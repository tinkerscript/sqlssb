const { Connection, Request } = require('tedious')
const driverSettings = {
  requestTimeout: 0,
  camelCaseColumns: true,
  rowCollectionOnRequestCompletion: true
}

module.exports = class DataAdapter {
  connect ({ server, user, password, database }) {
    this._connection = new Connection({
      server,
      userName: user,
      password,
      options: {
        database,
        ...driverSettings
      }
    })

    return new Promise((resolve, reject) => {
      this._connection.on('connect', err => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    })
  }

  receive (queue, { count = 1, timeout = 5000 } = {}) {
    if (!this._connection) {
      throw new Error('No connection')
    }

    const query = `waitfor(  
      RECEIVE top (${count})
        conversation_handle,
        service_name,
        message_type_name,
        message_body,
        message_sequence_number  
      FROM [${queue}]  
    ), timeout ${timeout}`

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

  send (serviceName, messageTypeName, messageBody, conversationId) {
    if (!this._connection) {
      throw new Error('No connection')
    }

    const query = `SEND ON CONVERSATION ${conversationId}
      MESSAGE TYPE [${messageTypeName}] ('${messageBody}');`

    return new Promise((resolve, reject) => {
      this._connection.execSql(new Request(query, err => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      }))
    })
  }
}
