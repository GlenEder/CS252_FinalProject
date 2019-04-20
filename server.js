let express = require('express');   //import express 
let socket = require('socket.io');  //import socket.io

let game = require('./game.js');

//set port from args 
var PORT;
if(arguments.length != 2) {
    PORT = 6656;
}else {
    PORT = arguments[1]
}


var clients = [];

function Client(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
}

//create server application 
let app = express();

//set server to listen for requests on port
let server = app.listen(PORT);

//allow server to use 'public' directory
app.use(express.static('public'));

//setup input output for server client
let io = socket(server);

//set event for new connection
io.sockets.on('connection', newConnection);


function newConnection(socket) {

    //print out new connection 
    console.log("New Connection: " + socket.id);
    
    socket.on('start', function(data) {
        let client = new Client(socket.id, data.x, data.y)
        clients.push(client);
    })

}

