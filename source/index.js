const EventEmitter = require('events')
const DataAdapter = require('./dataAdapter')

module.exports = class Sqlssb extends EventEmitter {
  constructor (config) {
    super()
    const { adapter: CustomAdapter, service } = config
    this._config = config
    this._dataAdapter = new (CustomAdapter || DataAdapter)({
      service
    })
  }

  get isActive () {
    return this._isActive
  }

  async start (options = {}) {
    const { server, user, password, database, queue } = this._config
    await this._dataAdapter.connect({ server, user, password, database })
    this._isActive = true

    do {
      const response = await this._dataAdapter.receive(queue, options)

      if (!response) {
        continue
      }

      const context = this.createContext(response)
      this.emit(context.messageTypeName, context)
    } while (this.isActive)
  }

  createContext (response) {
    const { service_name: serviceName } = response

    return {
      conversationId: response.conversation_handle,
      messageBody: response.message_body,
      messageTypeName: response.message_type_name,
      messageSequenceNumber: response.message_sequence_number,
      serviceName,
      dataAdapter: this._dataAdapter,
      reply: (messageTypeName, messageBody) => {
        this._dataAdapter.send(serviceName, messageTypeName, messageBody)
      }
    }
  }

  send (serviceName, messageTypeName, messageBody, conversationId) {
    return this._dataAdapter.send(
      serviceName,
      messageTypeName,
      messageBody,
      conversationId
    )
  }

  stop () {
    console.log('method "stop ()" is not implemented')
  }
}
