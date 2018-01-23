const EventEmitter = require('events')
const DataAdapter = require('./dataAdapter')
const Context = require('./context')

module.exports = class Sqlssb extends EventEmitter {
  constructor (config) {
    super()
    this._config = config
  }

  get isActive () {
    return this._isActive
  }

  async start (options = {}) {
    const { server, user, password, database, queue } = this._config
    const dataAdapter = new DataAdapter()
    await dataAdapter.connect({ server, user, password, database })
    this._isActive = true

    do {
      const response = await dataAdapter.receive(queue, options)

      if (!response) {
        continue
      }

      const context = new Context(response, dataAdapter)
      this.emit(context.messageTypeName, context)
    } while (this.isActive)
  }

  send () {
    console.log('method "send ()" is not implemented')
  }

  stop () {
    console.log('method "stop ()" is not implemented')
  }
}
