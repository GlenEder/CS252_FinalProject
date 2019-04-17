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

function newConnection(socket) {

    //print out new connection 
    console.log("New Connection: " + socket.id);

    //create user
    socket.on('createUser', function (data) {
         let success = addNewUser(data);

         if(success) {

         }else {
             socket.emit('userExists');
         }
    })




    //setup player position message
    socket.on('playerPosition', updatePlayerPosition);

    function updatePlayerPosition(data) {
        //send player position data to all other players
        socket.broadcast.emit('playerPosition', data);

        console.log(data);
    }
    

}

function addNewUser(data) {

    return false;
}