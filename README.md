# sqlssb
[![NPM version](https://badge.fury.io/js/badge-list.svg)](http://badge.fury.io/js/badge-list)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

SQL Server Service Broker client for Node.js

# Using
```javascript
const Sqlssb = require('sqlssb')
const service1 = new Sqlssb({
  user: 'sa',
  password: '<PASSOWRD>',
  server: 'localhost',
  database: 'sqlssbb',
  service: 'sqlssb-demo-sample-service',
  queue: 'sqlssb-demo-sample-queue'
})

service1.on('sqlssb-demo-message-type', ctx => {
  console.log(ctx.conversationId);
  console.log(ctx.messageBody);
  console.log(ctx.messageTypeName);
  console.log(ctx.messageSequenceNumber);
  console.log(ctx.serviceName);
})

service1.start({ //default settings:
  timeout: 5000, //5 seconds
  count: 1 //one message at a time
})
```

# Examples
See [demo](demo/) folder for more examples.
