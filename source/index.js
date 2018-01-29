const EventEmitter = require('events')
const DataAdapter = require('./dataAdapter')
const Context = require('./context')

module.exports = class Sqlssb extends EventEmitter {
  constructor (config) {
    super()
    const { adapter } = config

    this._config = config
    this._dataAdapter = adapter || new DataAdapter()
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

      const context = new Context(response, this._dataAdapter)
      this.emit(context.messageTypeName, context)
    } while (this.isActive)
  }

  send (serviceName, messageTypeName, messageBody) {
    return this._dataAdapter.send(serviceName, messageTypeName, messageBody)
  }

  stop () {
    console.log('method "stop ()" is not implemented')
  }
}
