const uuid = require('uuid/v1')
const EventEmitter = require('events')

module.exports = class FakeDataAdapter extends EventEmitter {
  connect () {}

  receive () {
    return new Promise(resolve => {
      this.on('message', ctx => {
        const {
          messageTypeName,
          messageBody,
          conversationId
        } = ctx

        resolve({
          conversation_handle: conversationId,
          message_body: messageBody,
          message_type_name: messageTypeName,
          message_sequence_number: 0,
          service_name: ''
        })
      })
    })
  }

  send (serviceName, messageTypeName, messageBody, conversationId) {
    if (!conversationId) {
      conversationId = uuid()
    }

    setTimeout(() => {
      this.emit('message', { messageTypeName, messageBody, conversationId })
    }, 50)
  }
}
