const Sqlssb = require('../../source')
const config = require('./config.json')
const app = new Sqlssb(config)

app.on('//sqlssb/demo_message', console.log)
app.start()
