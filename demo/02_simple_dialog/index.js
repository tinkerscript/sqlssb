const Sqlssb = require('../../source')
const service1 = new Sqlssb(require('../service1.config.json'))
const service2 = new Sqlssb(require('../service2.config.json'))

service1.on('//sqlssb/demo_message', ctx => {
  if (ctx.messageBody === 'STOP') {
    service1.stop()
    return
  }

  const n = parseInt(ctx.messageBody, 10)

  if (n) {
    console.log(`service1 received message "${n}"`)
    ctx.reply('//sqlssb/demo_message', n * 2)
  }
})

service2.on('//sqlssb/demo_message', ctx => {
  const n = parseInt(ctx.messageBody, 10)

  if (n >= 16) {
    ctx.reply('//sqlssb/demo_message', 'STOP')
    service2.stop()
    return
  }

  if (n) {
    console.log(`service2 received message "${n}"`)
    ctx.reply('//sqlssb/demo_message', n * 2)
  }
})

Promise.all([
  service1.start(),
  service2.start()
]).then(() => {
  return service1.send({
    target: 'sqlssb_demo_service_2',
    type: '//sqlssb/demo_message',
    contract: '//sqlssb/demo_contract',
    body: 2
  })
}).catch(err => {
  console.error(err)
})
