var socket;     //socket connection to server
var player;     //player object

let WIDTH = 601;
let HEIGHT = 501;
let GAME_WIDTH = 1000;
let GAME_HEIGHT = 1000;
let FRAMERATE = 60;

let mouseBufferZone = 50;
let spawnBufferZone = 50;

//if player has been added to server 
let playerAdded = false;

//id of player on server
var ID;

//array to hold data of other players
let otherPlayers = [];

//array of explosions
let explosions = [];

//color variables
var zombieColor;
var survivorColor;
var shieldColor;

//shield drawing radius (added on to player size)
let shieldRadius = 5;          


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
    let canvas = createCanvas(WIDTH, HEIGHT);

    background(51);

    //set colors 
    zombieColor = color('red');
    survivorColor = color('blue');
    shieldColor = color(0, 203, 255);  

    //set framerate
    frameRate(FRAMERATE)

    

    //create socket to server
    socket = io.connect('http://localhost:6656');

    //create new player and notify server 
    player = new Player(random(spawnBufferZone,  GAME_WIDTH - spawnBufferZone), random(spawnBufferZone, GAME_HEIGHT - spawnBufferZone));
    let data = {
        x: player.x,
        y: player.y
    }
    socket.emit('start', data);

    //set player id 
    socket.on("playerAdded", function(data) {
        ID = data;
        playerAdded = true;
    })

    socket.on("gameInfo", function(data) {
        //update otherplayers array
        otherPlayers = data;
    })

    socket.on('explosion', function(data) {
        let newExplo = new Explosion(data.x, data.y, false);
        explosions.push(newExplo);
    })

}

function draw() {

    if(playerAdded) {
        //update player
        player.update();

        //clear previous screen
        background(51);

        //draw borders
        drawBorder();

        //create position data of player for explosion render
        let position = {
            x: player.x,
            y: player.y
        };

        //update explosions
        for(var i = explosions.length - 1; i >= 0; i--) {
            //draw explosion
            explosions[i].render(position);

            //check if done
            if(explosions[i].update()) {
                explosions.splice(i, 1);
            }
           
        }

        //draw clients 
        for(var i = 0; i < otherPlayers.length; i++) {

            //don't draw player position in server
            if(otherPlayers[i].id != ID) {
        
                //calculate x and y positions of render
                let x = (WIDTH / 2) + (otherPlayers[i].x - player.x);
                let y = (HEIGHT / 2) + (otherPlayers[i].y - player.y);
        
                //draw shield if on 
                if(otherPlayers[i].shield) {
                    stroke(shieldColor);
                    fill(shieldColor);
                    ellipse(x, y, player.size + shieldRadius, player.size + shieldRadius);
                }

                //set color of player
                if(otherPlayers[i].isZomb) {
                    fill(zombieColor);
                }else {
                    fill(survivorColor);
                }

                //set stroke to white
                stroke(255);

                //draw other player
                ellipse(x, y, player.size, player.size);
            }
        }


        //draw player
        player.render();
    }
 
}

function drawBorder() {
    stroke(255);
    fill(255);

    //calculate positions relative to player
    let xLeft = (WIDTH / 2) - player.x;
    let xRight = (WIDTH / 2) + (GAME_WIDTH - player.x);
    let yTop = (HEIGHT / 2) - player.y;
    let yBottom = (HEIGHT / 2) + (GAME_HEIGHT - player.y);

    line(xLeft, yTop, xRight, yTop);
    line(xLeft, yTop, xLeft, yBottom);
    line(xRight, yTop, xRight, yBottom);
    line(xLeft, yBottom, xRight, yBottom);
}

function Player(xPos, yPos) {

    this.x = xPos;
    this.y = yPos;
    this.size = 30;
    this.halfSize = this.size / 2;
    this.speed = 2;
    this.isZombie = false;
    this.userColor = survivorColor;

    this.maxShieldLevel = 100;      //max shield energy
    this.shieldLevel = 100;         //current shield energy
    this.minShieldLevel = 75;       //min amount of shield energy to turn on
    this.shieldRechargeRate = 2;    //how fast shield regains energy 
    this.shieldDischargeRate = 5;   //how fast shield uses energy
    this.isShieldOn = false;        //if shield is on or not
    
    

    this.canExplode = true;
    this.explodeCooldown = 3;
    this.explodeTimer = 0;




    this.render = function() {

        //draw shield on player if on
        if(this.isShieldOn) {
            stroke(shieldColor);
            fill(shieldColor);
            ellipse(WIDTH / 2, HEIGHT / 2, this.size + shieldRadius, this.size + shieldRadius);
        }

        //draw body
        stroke(255);
        
        if(this.isZombie) {
            fill(zombieColor);
        }else {
            fill(survivorColor);
        }

        ellipse(WIDTH / 2, HEIGHT / 2, this.size, this.size);

        //draw shield energy bar
        fill(255);
        rect(10, 10, this.maxShieldLevel, 13);
        fill(shieldColor);
        rect(10, 10, this.shieldLevel, 13);

    
    }

    this.update = function() {

        //handle mouse input
        if(mouseIsPressed) {

            //use left click for movment 
            if (mouseButton == LEFT) {
                this.moveInMouseDirection();
                //cap movement to stay inside bounds
                this.capMovement(); 
            }

            //user right click for shield 
            if(mouseButton == RIGHT) {
                //turn shield on if above min level
                if(this.shieldLevel > this.minShieldLevel) {this.isShieldOn = true;}
            }

        }
        else {
            //turn shield off
            this.isShieldOn = false;
        }    
        
        
    
        //update shield data
        this.updateShield();

        //udpate explosion data
        this.updateExplosion();

        //check for collisions with explosios
        this.checkCollisions();
            
        //package player position
        let data = {
            x: this.x,
            y: this.y,
            isZombie: this.isZombie,
            shield: this.isShieldOn
        };

        //console.log(data);

        //send player position to server
        socket.emit('update', data);

    }


    this.checkCollisions = function() {
        //check for intersections of player with explosions 
        for(var i = 0; i < explosions.length; i++) {
            //check if explosison is own
            if(explosions[i].own == false) {
                let xdiff = this.x - explosions[i].x;
                let ydiff = this.y - explosions[i].y;
                let distance = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));

                if(distance < this.halfSize + (explosions[i].size / 2)) {
                    this.isZombie = true;
                }

                break;
            }
        }
    }


    this.createExplosion = function() {

        if(this.canExplode) {
            //create new explosion and add to array
            let newExplo = new Explosion(this.x, this.y, true);
            explosions.push(newExplo);

            //set can exploed to false and start timer 
            this.canExplode = false;
            this.explodeTimer = 0;

            //send explosion to server
            let data = {
                x: this.x,
                y: this.y
            };
            socket.emit('explosion', data);
        }
        
        
    }

    this.updateExplosion = function() {
        //increase timer
        this.explodeTimer++;
            
        //check if timer exceds cooldown
        if(this.explodeTimer > this.explodeCooldown * FRAMERATE) {
            this.canExplode = true;
            this.explodeTimer = 0;
        } 
    }

    //handle shield 
    this.updateShield = function() {
        //if shield is on
        if(this.isShieldOn) {
            //lower shield power level
            this.shieldLevel -= this.shieldDischargeRate;

            //cap at 0
            if(this.shieldLevel < 0) {
                this.shieldLevel = 0;

                //turn shield off if hit 0
                this.isShieldOn = false;
            }
        }
        else {
            //recharge shield
            this.shieldLevel += this.shieldRechargeRate;

            //cap max shieldLevel
            if(this.shieldLevel > this.maxShieldLevel) {
                this.shieldLevel = this.maxShieldLevel;
            }
        }
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

    this.capMovement = function(){
        //cap x position
        if(this.x - this.halfSize < 0) {
            this.x = this.halfSize;
        }
        else if (this.x + this.halfSize > GAME_WIDTH) {
            this.x = GAME_WIDTH - this.halfSize;
        }

        //cap y position
        if(this.y - this.halfSize < 0) {
            this.y = this.halfSize;
        }
        else if(this.y + this.halfSize > GAME_HEIGHT) {
            this.y = GAME_HEIGHT - this.halfSize;
        }
    }
}

function keyPressed() {
    if(keyCode == 69) {
        if(player != null) {
            player.createExplosion();
        }
    }
}

function Explosion(xPos, yPos, isOwned) {

    this.x = xPos;
    this.y = yPos;
    this.own = isOwned;
    this.size = 20;
    this.expRate = 2;   //rate of explosion expansion
    this.maxSize = 100;  //max size of explosion
    this.color = color(249, 149, 0);    //color of explosion

    this.update = function() {
        //increase size
        this.size += this.expRate;
        if(this.size > this.maxSize) {
            this.size = this.maxSize;
            return true;
        }

        return false;
    }

    this.render = function(pos) {
        stroke(this.color);
        noFill();
        ellipse((WIDTH / 2) + (this.x - pos.x), (HEIGHT / 2) + (this.y - pos.y), this.size, this.size);
    }

}








