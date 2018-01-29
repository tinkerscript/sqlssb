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
})
