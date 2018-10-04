var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleX = canvas.width/2 - paddleWidth/2;
var paddleWidth = 50;
var paddleHeight = 10;
var paddleSpeed = 5;
var direction = "";

//key listener for paddle control
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function move(){
    if(leftPressed){
        paddleX += paddleSpeed;
    }
    else if(rightPressed){
        paddleX -= paddleSpeed;
    }
    else {}
        //no movement to be done
}
   
function keyDownHandler(e) {
    //37 is key code for right key
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    //ball collides and bounces off
    if(x+ballRadius > canvas.width || x < 0+ballRadius)
        dx *= -1;
    if(y < 0+ballRadius || y+ballRadius > canvas.height)
        dy *= -1;
    
        x += dx;
        y += dy;
}

setInterval(draw, 10);