app = module.parent.exports
request = require 'request'

app.get '/*', (req, res) -> res.render 'index'

app.post '/request', (req, res) ->

  options = 
    uri: req.body.uri
    method: req.body.method

  if options.method in ['POST', 'PUT']
    options.json = req.body.json

  request options, (err, response, body) ->
    if !err
      try
        res.send JSON.parse(body)
      catch err
        res.send body
    else
      res.send message: 'Error on requesting'