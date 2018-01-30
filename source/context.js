module.exports = class Context {
  constructor (response, dataAdapter) {
    this._response = response
    this._dataAdapter = dataAdapter
  }

  get conversationId () {
    return this._response.conversation_handle
  }

  get messageBody () {
    return this._response.message_body
  }

  get messageTypeName () {
    return this._response.message_type_name
  }

  get messageSequenceNumber () {
    return this._response.message_sequence_number
  }

  get serviceName () {
    return this._response.service_name
  }

  get dataAdapter () {
    return this._dataAdapter
  }

  reply (messageTypeName, messageBody) {
    this.dataAdapter.send(this.serviceName, messageTypeName, messageBody)
  }
}
