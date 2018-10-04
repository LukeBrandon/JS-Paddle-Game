var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var ballX = canvas.width/2;
var ballY = canvas.height-40;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleSpeed = 5;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = paddleHeight -5;
var rightPressed = false;
var leftPressed = false;

//brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickGotHit = false;
//initialize bricks
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1};
    }
}


//key listener for paddle control
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//-----------Individual Draw Methods-----------------
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleY, paddleWidth, paddleHeight-15);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
            //drawing bricks
            var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft
            var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            //if bricks has been hit then don't draw it
            brickGotHit = collisionDetection(bricks[c][r].x, bricks[c][r].y, bricks[c][r].status);
            if(brickGotHit)
                bricks[c][r].status = 0;
            else
            bricks[c][r].status = 1;

            ctx.beginPath();
            //only draw if it hasn't been hit
            if(bricks[c][r].status == 1)ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

function collisionDetection(x, y, status){
    if(ballX +ballRadius < x)    //left
        return false;
    else if(ballX > x+brickWidth)
        return false;
    else if(ballY> y + brickHeight)
        return false;
    else if(ballY < y)
        return false;
    return true;
}

   
//------------Key event Methods------------------
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


//----------------Draw Method-------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();

    //ball collides and bounces off
    if(ballX+ballRadius > canvas.width || ballX < 0+ballRadius)
        dx *= -1;
    if(ballY < 0+ballRadius || ballY + ballRadius > canvas.height)
        dy *= -1;

    //Ball hits bottom, you lose
    if(ballY + ballRadius > canvas.height){
        // alert("GAME OVER");
        // document.location.reload();

    }

    //Collision with paddle
    if(ballX+ballRadius <= paddleX+paddleWidth && ballX+ballRadius >= paddleX  && ballY + ballRadius > canvas.height - paddleY)    //collides if in between the two sides of paddle and is inside paddle
        dy*=-1;

    
    //if the arrow key sare pressed move the paddle
    if(rightPressed && paddleX + paddleWidth < canvas.width)
        paddleX += paddleSpeed;
    if(leftPressed && paddleX > 0)
        paddleX -= paddleSpeed;


        ballX += dx;
        ballY += dy;
}

setInterval(draw, 10);