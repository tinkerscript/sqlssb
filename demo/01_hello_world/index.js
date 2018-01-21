const Sqlssb = require('../../source')
const config = require('../service1.config.json')
const service1 = new Sqlssb(config)

service1.on('//sqlssb/demo_message', ctx => {
  console.log(ctx.message_body)
})

service1.start()
