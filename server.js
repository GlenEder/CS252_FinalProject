let express = require('express');   //import express 
let socket = require('socket.io');  //import socket.io

let game = require('./game.js');

let postRate = 60;

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
    this.isZomb = false;
    this.shield = false;
}

//create server application 
let app = express();

//set server to listen for requests on port
let server = app.listen(PORT, '192.168.1.37');

//allow server to use 'public' directory
app.use(express.static('public'));

//setup input output for server client
let io = socket(server);

//set event for new connection
io.sockets.on('connection', newConnection);

//set interval for sending player information
setInterval(broadcastInfo, 1000 / postRate);

//send clinets array to every client 
function broadcastInfo() {
    //check for winner
    var winnerId;
    let surviviorCount = 0;
    for(var i = 0; i < clients.length; i++) {
        if(clients[i].isZomb == false) {
            winnerId = clients[i].id;
            surviviorCount++;
        }
    }


    if(surviviorCount == 1 && clients.length > 1) {
        io.sockets.emit('winner', winnerId);
    }else {
        io.sockets.emit("gameInfo", clients);
    }


   
}


function newConnection(socket) {

    //print out new connection 
    console.log("New Connection: " + socket.id);
    
    //handle player creation
    socket.on('start', function(data) {
        let client = new Client(socket.id, data.x, data.y)
        clients.push(client);
        socket.emit("playerAdded", socket.id);
    })

    //handle player updates
    socket.on('update', function(data) {
        let cl = clients[getIndexOfClient(socket.id)];
        if(cl != null) {
            cl.x = data.x;
            cl.y = data.y;
            cl.isZomb = data.isZombie;
            cl.shield = data.shield;
        }
    });

    socket.on('explosion', function(data) {
        socket.broadcast.emit('explosion', data);
    })

    //handle disconnets 
    socket.on('disconnect', function() {
        //log disconnect
        console.log("User " + socket.id + " disconnected");

        //remove user from client list
        let index = getIndexOfClient(socket.id);
        if(index >= 0) {
            clients.splice(index, 1);
        }
       
    });

}

function getIndexOfClient(socketID) {
    //loop through clients 
    for(var i = 0; i < clients.length; i++) {
        if(socketID == clients[i].id) {
            return i;
        }
    }

    return -1;
} 


