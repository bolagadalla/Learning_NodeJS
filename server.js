const { response } = require('express')
var express = require('express')

// Instance of express 
var app = express()

// Creating an http server to share with express and socket.io
var http = require('http').Server(app)

// Initilizing socket.io, passing in the http server
var io = require('socket.io')(http)

// Serving a static html file
app.use(express.static(__dirname))
app.use(express.urlencoded({extended: true}));
app.use(express.json())
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
    // This will notify ALL users when a new message is sent
    // by sending them the message is self thats stored in request.body
    io.emit('message', request.body)
    response.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log('A user connected')
})

// Listens for requests
var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})