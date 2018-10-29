var express = require('express')
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic(__dirname + '/dist', { 'index': ['index.html', 'index.htm'] }))   
app.listen(5836)