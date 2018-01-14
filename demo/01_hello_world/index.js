const Sqlssb = require('../..')
const config = require('./config.json')
const app = new Sqlssb(config)

app.on('sqlssb/demo/hello_world', console.log)
app.listen('sqlssb_demo_queue_1')
