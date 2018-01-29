/* eslint-env mocha */
const assert = require('assert')
const Sqlssb = require('../source')
const FakeDataAdapter = require('./fakeDataAdapter')

describe('sqlssb', () => {
  it('should receive message', done => {
    const adapter = new FakeDataAdapter()
    const service = new Sqlssb({
      adapter
    })

    service.on('sample-message-type', ({ messageBody }) => {
      assert.equal(messageBody, 'test')
      done()
    })

    service.start()
    adapter.send('sqlssb1', 'sample-message-type', 'test')
  })

  it('should provide simple messaging', () => {
    const adapter = new FakeDataAdapter()
    const service1 = new Sqlssb({ adapter })
    const service2 = new Sqlssb({ adapter })

    service1.on('sample-message-type', ({ messageBody }) => {
      assert.equal(messageBody, 'hello')
    })

    service1.start()
    service2.send('sqlssb1', 'sample-message-type', 'hello')
  })

  it('should provide dialog', () => {
    const adapter = new FakeDataAdapter()
    const service1 = new Sqlssb({ adapter })
    const service2 = new Sqlssb({ adapter })

    return new Promise(resolve => {
      const dialog = []

      service1.on('sample-message-type', ctx => {
        const { messageBody } = ctx
        dialog.push(messageBody)

        if (messageBody === 'well hello') {
          ctx.reply('sample-message-type', 'bye')
        }
      })

      service2.on('sample-message-type', ctx => {
        const { messageBody } = ctx
        dialog.push(messageBody)

        if (messageBody === 'hello') {
          ctx.reply('sample-message-type', 'well hello')
        }

        if (messageBody === 'bye') {
          resolve(dialog)
        }
      })

      service1.start()
      service2.start()
      service1.send('sqlssb2', 'sample-message-type', 'hello')
    }).then(dialog => {
      assert.deepEqual(dialog, ['hello', 'well hello', 'bye'])
    })
  })
})
