express = require 'express'
app = module.exports = express()

app.configure ->
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'
  app.set 'view options', layout: false
  app.use require('stylus').middleware "#{__dirname}/public"
  app.use express.static("#{__dirname}/public")
  app.use express.favicon()
  app.use express.bodyParser()
  app.use express.methodOverride()

app.configure 'development', ->
  app.use express.logger('dev')
  app.use express.errorHandler()

require './controller'

port = process.env.PORT or 3010
environment = app.get 'env'
app.listen port, ->
  console.log "RESTfront listening on port #{port} [#{environment}]"