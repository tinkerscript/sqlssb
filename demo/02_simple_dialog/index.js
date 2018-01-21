const Sqlssb = require('../../source')
const config1 = require('../service1.config.json')
const config2 = require('../service1.config.json')
const service1 = new Sqlssb(config1)
const service2 = new Sqlssb(config2)

service1.on('//sqlssb/demo_message', ctx => {
  console.log(ctx.message_body)
})

service2.on('//sqlssb/demo_message', ctx => {
  console.log(ctx.message_body)
})

service1.start()
service2.start()
