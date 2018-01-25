const uuid = require('uuid/v1')
const EventEmitter = require('events')

module.exports = class FakeDataAdapter extends EventEmitter {
  connect () {}

  receive () {
    return new Promise(resolve => {
      this.on('message', ({
        messageTypeName,
        messageBody,
        conversationId
      }) => {
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

  send (conversationId, messageTypeName, messageBody) {
    if (!conversationId) {
      conversationId = uuid()
    }

    this.emit('message', { messageTypeName, messageBody, conversationId })
  }
}
