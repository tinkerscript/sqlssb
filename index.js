module.exports = class Sqlssb {
  constructor (config) {
    this._config = config
  }

  listen (port, options) {
    console.log(`listening in port [${port}]`)
  }

  on (messageType, handler) {
    //
  }
}
