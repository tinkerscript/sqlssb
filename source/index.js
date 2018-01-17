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
    const { queue } = this._config
    const dataAdapter = new DataAdapter()
    await dataAdapter.connect(this._config)
    this._isActive = true

    do {
      const result = await dataAdapter.receive(queue, options)

      if (!result) {
        continue
      }

      const { message_type_name, message_body } = result
      this.emit(message_type_name, message_body)
    } while (this.isActive)
  }
}
