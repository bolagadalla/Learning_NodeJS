const { response } = require('express')
var express = require('express')
var body = require('body-parser')

// Instance of express 
var app = express()

// Serving a static html file
app.use(express.static(__dirname))
app.use(body.json())
// Array of messages
var messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jim', message: 'Hello'},
]

// Handles 'get' requests
app.get('/messages', (request, response) => {
    response.send(messages)
})

// Handles 'post' requests
app.post('/messages', (request, response) => {
    // Adds the new message to the messages array
    messages.push(request.body)
    response.sendStatus(200)
})

// Listens for requests
var server = app.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})