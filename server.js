let express = require('express');   //import express 
let socket = require('socket.io');  //import socket.io

//set port from args 
var PORT;
if(arguments.length != 2) {
    PORT = 6656;
}else {
    PORT = arguments[1]
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

function newConnection(data) {
    
}