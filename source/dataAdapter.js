const { Connection, Request } = require('tedious')
const driverSettings = {
  requestTimeout: 0,
  camelCaseColumns: true,
  rowCollectionOnRequestCompletion: true
}

module.exports = class DataAdapter {
  constructor (config) {
    this._config = config
  }

  _connect () {
    const { server, user, password, database } = this._config

    const connection = new Connection({
      server,
      userName: user,
      password,
      options: {
        database,
        ...driverSettings
      }
    })

    return new Promise((resolve, reject) => {
      connection.on('connect', err => {
        if (err) {
          reject(err)
          return
        }

        resolve(connection)
      })
    })
  }

  connect () {
    return this._connect().then(connection => {
      this._connection = connection
    })
  }

  receive ({ count = 1, timeout = 5000 } = {}) {
    if (!this._connection) {
      throw new Error('No connection')
    }

    const { queue } = this._config

    const query = `WAITFOR (  
      RECEIVE TOP (${count})
        conversation_handle,
        service_name,
        message_type_name,
        message_body,
        message_sequence_number  
      FROM [${queue}]  
    ), TIMEOUT ${timeout}`

    return new Promise((resolve, reject) => {
      this._connection.execSql(new Request(query, (err, rowCount, [rows]) => {
        if (err) {
          reject(err)
          return
        }

        if (!rows) {
          resolve()
          return
        }

        const response = rows.reduce((acc, current) => {
          const key = current.metadata.colName
          acc[key] = current.value
          return acc
        }, {})

        response.message_body = response.message_body.toString()
        resolve(response)
      }))
    })
  }

  async send ({ target, type, body, contract, conversationId }) {
    const connection = await this._connect()
    const lines = [`DECLARE @DialogId UNIQUEIDENTIFIER;`]
    const from = this._config.service

    if (conversationId) {
      lines.push(`SET @DialogId = '${conversationId}';`)
    } else {
      lines.push(...[
        `BEGIN DIALOG @DialogId`,
        `FROM SERVICE [${from}] TO SERVICE '${target}'`,
        `ON CONTRACT [${contract}] WITH ENCRYPTION=OFF;`
      ])
    }

    lines.push(...[
      `SEND ON CONVERSATION @DialogId`,
      `MESSAGE TYPE [${type}] ('${body}');`
    ])

    const query = lines.join('\n')

    return new Promise((resolve, reject) => {
      connection.execSql(new Request(query, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
        connection.close()
      }))
    })
  }

  stop () {
    this._connection.cancel()
    this._connection.close()
  }
}
