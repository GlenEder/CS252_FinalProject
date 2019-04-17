var socket;     //socket connection to server

function setup() {
    //create html canvas
    createCanvas(400, 400);
    background(51);

    //create socket to server
    socket = io.connect('http://localhost:6656');
}

function draw() {
   
}