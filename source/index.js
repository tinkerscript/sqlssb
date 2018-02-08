const EventEmitter = require('events')
const DataAdapter = require('./dataAdapter')

module.exports = class Sqlssb extends EventEmitter {
  constructor (config) {
    super()
    const { adapter: CustomAdapter } = config
    this._dataAdapter = new (CustomAdapter || DataAdapter)(config)
  }

  get isActive () {
    return this._isActive
  }

  async _listen (options) {
    do {
      const response = await this._dataAdapter.receive(options)

      if (!response) {
        continue
      }

      const context = this.createContext(response)
      this.emit(context.messageTypeName, context)
    } while (this.isActive)
  }

  async start (options = {}) {
    const connected = this._dataAdapter.connect()

    connected.then(() => {
      this._isActive = true
      this._listen(options)
    }).catch(err => {
      console.error(err)
    })

    return connected
  }

  createContext (response) {
    const {
      service_name: serviceName,
      conversation_handle: conversationId
    } = response

    return {
      conversationId,
      messageBody: response.message_body,
      messageTypeName: response.message_type_name,
      messageSequenceNumber: response.message_sequence_number,
      serviceName,
      dataAdapter: this._dataAdapter,
      reply: (messageTypeName, messageBody) => {
        this._dataAdapter.send({
          target: serviceName,
          type: messageTypeName,
          body: messageBody,
          conversationId
        })
      }
    }
  }

  send (args) {
    return this._dataAdapter.send(args)
  }

  stop () {
    this._dataAdapter.stop()
    this._isActive = false
  }
}
