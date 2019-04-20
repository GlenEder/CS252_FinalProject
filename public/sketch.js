var socket;     //socket connection to server
var player;     //player object

let WIDTH = 601;
let HEIGHT = 501;
let FRAMERATE = 30;

let mouseBufferZone = 100;
var survivorColor;
var zombieColor;


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBaDeefOtZNxxFXvacoXIMBGZB_S8a_HIc",
    authDomain: "feastinfest.firebaseapp.com",
    databaseURL: "https://feastinfest.firebaseio.com",
    projectId: "feastinfest",
    storageBucket: "",
    messagingSenderId: "118729444601"
};
firebase.initializeApp(config);

//handle user logged in/out
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        //User logged in
    } else {
        //handle user logged in
        window.location.href = "index.html";
    }
});

function setup() {
    //create html canvas
    createCanvas(WIDTH, HEIGHT);
    background(51);

    //set colors 
    zombieColor = color('red');
    survivorColor = color('blue');

    //set framerate
    frameRate(FRAMERATE)

    

    //create socket to server
    socket = io.connect('http://localhost:6656');

    //create player 
    player = new Player("name", 100, 100);

}

function draw() {

    if(player != null) {
        //update player
        player.update();

        //clear previous screen
        background(51);

        //render player
        player.render();
    }
    
}

function Player(name, xPos, yPos) {

    this.username = name;
    this.x = xPos;
    this.y = yPos;
    this.size = 30;
    this.speed = 1;
    this.isZombie = false;
    this.userColor = survivorColor;


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
            isZombie: this.isZombie,
            name: this.username,
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

function OtherPlayer(name, x, y, zomb) {
    this.username = name;
    this.xPos = x;
    this.yPos = y;
    this.isZombie = zomb;

    this.render = function() {
        console.log("rendering other player");
        if(this.isZombie) {
            fill(zombieColor);
        }else {
            fill(survivorColor);
        }

        let x = (WIDTH / 2) + (data.x - player.x);
        let y = (HEIGHT / 2) + (data.y - player.y);

        ellipse(x, y, player.size, player.size);
    }
}


