const { Connection, Request } = require('tedious')

module.exports = class DataAdapter {
  connect (config) {
    this._connection = new Connection(config)

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

        const result = rows.reduce((acc, current) => {
          const key = current.metadata.colName
          acc[key] = current.value
          return acc
        }, {})

        result.message_body = result.message_body.toString()
        resolve(result)
      }))
    })
  }
}
