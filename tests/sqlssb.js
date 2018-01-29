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

  /* it('should provide messaging', () => {
    const service1 = new Sqlssb({})
    const service2 = new Sqlssb({})

    service1.connect()
    service2.connect()

    service1.on('sample-message-type', ({ messageBody }) => {
      assert.equal(messageBody, 'test')
    })

    service2.send('sample-message-type', 'test')
  }) */
})
