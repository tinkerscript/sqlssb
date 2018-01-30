/* eslint-env mocha */
const assert = require('assert')
const Sqlssb = require('../source')
const FakeDataAdapter = require('./fakeDataAdapter')

describe('sqlssb', function () {
  this.timeout(1000000)

  beforeEach(() => {
    FakeDataAdapter.init({
      sqlssb1: 'queue1',
      sqlssb2: 'queue2'
    })
  })

  afterEach(() => {
    FakeDataAdapter.flush()
  })

  it('should receive message', done => {
    const service = new Sqlssb({
      adapter: FakeDataAdapter,
      service: 'sqlssb1',
      queue: 'queue1'
    })

    service.on('sample-message-type', ({ messageBody }) => {
      assert.equal(messageBody, 'test')
      done()
    })

    service.start()
    FakeDataAdapter.send('sqlssb2', 'sqlssb1', {
      messageTypeName: 'sample-message-type',
      messageBody: 'test'
    })
  })

  it('should provide simple messaging', done => {
    const service1 = new Sqlssb({
      adapter: FakeDataAdapter,
      service: 'sqlssb1',
      queue: 'queue1'
    })
    const service2 = new Sqlssb({
      adapter: FakeDataAdapter,
      service: 'sqlssb2',
      queue: 'queue2'
    })

    service1.on('sample-message-type', ({ messageBody }) => {
      assert.equal(messageBody, 'hello')
      done()
    })

    service1.start()
    service2.send('sqlssb1', 'sample-message-type', 'hello')
  })

  it('should provide dialog', () => {
    const service1 = new Sqlssb({
      adapter: FakeDataAdapter,
      service: 'sqlssb1',
      queue: 'queue1'
    })
    const service2 = new Sqlssb({
      adapter: FakeDataAdapter,
      service: 'sqlssb2',
      queue: 'queue2'
    })

    return new Promise(resolve => {
      const dialog = []
      debugger
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
