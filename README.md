# sqlssb
SQL Server Service Broker client for Node.js

# Using
```javascript
const Sqlssb = require('sqlssb')
const app = new Sqlssb({
  username: '',
  password: '',
  server: '',
  database: ''
})

app.on('sqlssb-demo-message-type', msg => {
  console.log(msg);
  //conversation_handle,
  //service_name,
  //message_type_name,
  //message_body,
  //message_sequence_number 
})

app.listen('demo-queue-name', {
  timeout: 5000, //5 seconds
  count: 1 //one message at a time
})
```
