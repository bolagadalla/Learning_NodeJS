const { response } = require('express')
var express = require('express')
// Instance of express 
var app = express()
// Creating an http server to share with express and socket.io
var http = require('http').Server(app)
// Initilizing socket.io, passing in the http server
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var config = require('./config.json')

// Serving a static html file
app.use(express.static(__dirname))
app.use(express.urlencoded({extended: true}));
app.use(express.json())

// Connection URL --> mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority
const dbUrl = `mongodb+srv://${config.dbUser}:${config.dbPass}@cluster0.qwnvk.mongodb.net/${config.dbName}?retryWrites=true&w=majority`

// This is a model for database
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

// Array of messages
// var messages = [
//     {name: 'Tim', message: 'Hi'},
//     {name: 'Jim', message: 'Hello'},
// ]

// Handles 'get' requests
app.get('/messages', (request, response) => {
    Message.find({}, (err, messages) => {
        response.send(messages)
    })
})

// Handles 'post' requests
app.post('/messages', (request, response) => {
    // Create a new message object with the request.body's data
    var message = new Message(request.body)
    // Save this model object to the database
    message.save((err) => {
        if(err){ sendStatus(500) } // server error
        else
        {
            // Adds the new message to the messages array
            messages.push(request.body)
            // This will notify ALL users when a new message is sent
            // by sending them the message is self thats stored in request.body
            io.emit('message', request.body)
            response.sendStatus(200)
        }
    })
})

io.on('connection', (socket) => {
    console.log('A user connected')
})

// Connect to mongoose
mongoose.connect(dbUrl,{useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    console.log('Mongo DB Connection Error:', err)
})

// Listens for requests
var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})