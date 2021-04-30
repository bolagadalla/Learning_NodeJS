var express = require('express')

// Instance of express 
var app = express()

// Serving a static html file
app.use(express.static(__dirname))
// Listens for requests
app.listen(3000)