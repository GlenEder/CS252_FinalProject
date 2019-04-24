


function Game(ID) {

    this.id = ID;       //game id
    this.players = [];  //list of players sockets

    this.addPlayer = function(socket) {

        //setup player position message
        socket.on('playerPosition', function (data) {
        //send player position data to all other players
            for(var i = 0; i < this.players.size; i++) {
                this.players[i].emit('playerPosition', data);
            }
        });
    }

}

