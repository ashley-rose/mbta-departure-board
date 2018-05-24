const path = require('path')
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')

const version = require('../../package.json').version
const DepartureManager = require('./departure-manager')
const handle = require('./handle')

// Get the port from the process environment or default to 3000
const port = process.env.NODE_PORT || 3000
const app = express()
const dm = new DepartureManager()

// Enable middleware
app.use(compression())
app.use(morgan(app.get('env') === 'development' ? 'dev' : 'short'))

// Set up data routes
app.get('/stations/origins.json', handle(() => dm.originStations()))
app.get(
  '/stations/:stationId/departures.json',
  handle(req => dm.tripsFrom(req.params.stationId))
)

// In development, mount webpack directly, otherwise serve precompiled assets
// from the dist directory
if (app.get('env') === 'development') {
  const webpack = require('webpack')
  const middleware = require('webpack-dev-middleware')
  const config = require('../../webpack.config.js')

  const compiler = webpack(Object.assign({}, config, {
    mode: 'development'
  }))

  app.use(middleware(compiler, {
    publicPath: `http://localhost:${port}/`,
    logLevel: 'warn'
  }))
} else {
  app.use(express.static(path.resolve(__dirname, '../../dist')))
}

// Boot up the application
app.listen(
  port,
  () => console.log(`MBTA depature board ${version} listening on port ${port}`)
)
