/* eslint-env mocha */
const assert = require('assert')
const Sqlssb = require('../source')

describe('sqlssb', () => {
  it('should provide messaging', () => {
    const service1 = new Sqlssb({})
    const service2 = new Sqlssb({})

    service1.connect()
    service2.connect()

    service1.on('sample-message-type', ({ messageBody }) => {
      assert.equal(messageBody, 'test')
    })

    service2.send('sample-message-type', 'test')
  })
})
