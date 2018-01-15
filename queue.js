const { Connection, Request } = require('tedious')
const config = require('./demo/01_hello_world/config.json')
const connection = new Connection(config)
const query = `waitfor(  
  RECEIVE top (1)
    conversation_handle,
    service_name,
    message_type_name,
    message_body,
    message_sequence_number  
  FROM [sqlssb_demo_queue_2]  
)`

connection.on('connect', err => {
  if (err) {
    console.error(err)
    return
  }

  connection.execSql(new Request(query, (err, rowCount, [rows]) => {
    if (err) {
      console.error(err)
      return
    }

    const result = rows.reduce((acc, current) => {
      const key = current.metadata.colName
      acc[key] = current.value
      return acc
    }, {})

    result.message_body = result.message_body.toString()

    console.log(result)
  }))
})
