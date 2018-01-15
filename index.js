const EventEmitter = require('events')

module.exports = class Sqlssb extends EventEmitter {
  constructor (config) {
    super()
    this._config = config
  }

  listen (port, options) {
    console.log(`listening in port [${port}]`)
  }
}
