const EventEmitter = require('events')
const DataAdapter = require('./dataAdapter')

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
      const result = await dataAdapter.receive(queue, options)

      if (!result) {
        continue
      }

      const { message_type_name } = result
      const ctx = { ...result }
      this.emit(message_type_name, ctx)
    } while (this.isActive)
  }
}
