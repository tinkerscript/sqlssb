const uuid = require('uuid/v1')
const EventEmitter = require('events')
const DataAdapter = require('../source/dataAdapter')

module.exports = class FakeDataAdapter extends DataAdapter {
  static init (services) {
    this._services = services
    this._queues = Object.entries(services).reduce((result, [, queue]) => {
      result[queue] = new EventEmitter()
      return result
    }, {})
  }

  static flush () {
    Object.entries(this._queues).forEach(([, emitter]) => {
      emitter.removeAllListeners()
    })
  }

  static send (from, to, { messageTypeName, messageBody }) {
    const queue = FakeDataAdapter._services[to]

    setTimeout(() => {
      this._queues[queue].emit('message', {
        serviceName: to,
        messageTypeName,
        messageBody
      })
    }, 50)
  }

  connect () {
    return Promise.resolve()
  }

  receive () {
    const { queue } = this._config

    return new Promise(resolve => {
      FakeDataAdapter._queues[queue].on('message', ctx => {
        const {
          serviceName,
          messageTypeName,
          messageBody,
          conversationId
        } = ctx

        resolve({
          conversation_handle: conversationId,
          message_body: messageBody,
          message_type_name: messageTypeName,
          message_sequence_number: 0,
          service_name: serviceName
        })
      })
    })
  }

  send (serviceName, messageTypeName, messageBody, conversationId) {
    if (!conversationId) {
      conversationId = uuid()
    }

    FakeDataAdapter.send(this._config.service, serviceName, {
      messageTypeName, messageBody, conversationId
    })
  }
}
