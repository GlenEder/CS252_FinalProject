var socket;     //socket connection to server
var player;     //player object

let WIDTH = 601;
let HEIGHT = 501;
let FRAMERATE = 30;

let mouseBufferZone = 100;

function setup() {
    //create html canvas
    createCanvas(WIDTH, HEIGHT);
    background(51);

    //create player
    player = new Player(100, 100);

    //set framerate
    frameRate(FRAMERATE)

    //create socket to server
    socket = io.connect('http://localhost:6656');
}

function draw() {

    //update player
    player.update();

    //render player
    player.render();
}

function Player(xPos, yPos) {

    this.x = xPos;
    this.y = yPos;
    this.size = 30;
    this.speed = 1;
    this.isZombie = false;
    this.userColor = color(255, 0, 0);


    this.render = function() {
        stroke(255);
        fill(this.userColor);
        ellipse(WIDTH / 2, HEIGHT / 2, this.size, this.size);
    }

    this.update = function() {
        if(mouseIsPressed) {this.moveInMouseDirection();}
        
        //package player position
        let data = {
            x: this.x,
            y: this.y,
            isZombie: this.isZombie
        };

        //send player position to server
        socket.emit('playerPosition', data);

    }

    this.moveInMouseDirection = function() {
    
        //check mouse up and down
        if(mouseY < (HEIGHT / 2) - mouseBufferZone) {
            this.y -= this.speed;
        }
        else if(mouseY > (HEIGHT / 2) + mouseBufferZone) {
            this.y += this.speed;
        }

        //check mouse left and right
        if(mouseX < (WIDTH / 2) - mouseBufferZone) {
            this.x -= this.speed;
        }
        else if(mouseX > (WIDTH / 2) + mouseBufferZone) {
            this.x += this.speed;
        }
    }




}

function getMouseDirection() {

    
}