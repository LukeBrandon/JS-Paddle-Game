var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var ballX = canvas.width/2;
var ballY = canvas.height-40;
var prevX = ballX;
var prevY = ballY;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleSpeed = 5;
var paddleX = (canvas.width-paddleWidth)/2;
var prevPaddleX = (canvas.width-paddleWidth)/2;
var paddleY = paddleHeight -5;
var paddleVelocity = prevPaddleX-paddleX;
var rightPressed = false;
var leftPressed = false;

var lives = 3;
var score = 0;

//brick variables
var brickRowCount = 3;
var brickColumnCount = 6;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickGotHit = false;
var bricksRemaining = brickRowCount * brickColumnCount;
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
document.addEventListener("mousemove", mouseMoveHandler, false);


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

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = " #0095DD"
    ctx.fillText("Score: " + score, 8,20);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = " #0095DD"
    ctx.fillText("Lives: " + lives,80,20);
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
            bricks[c][r].status = 1;
            //if bricks has been hit then don't draw it
            brickGotHit = collisionDetection(bricks[c][r].x, bricks[c][r].y);
            if(brickGotHit){
                bricks[c][r].status = 0;
                score++;
                bricksRemaining--;
                console.log("collides with brick c:" + c + " r: "+ r);
                bounceOffBrick(bricks[c][r].x, bricks[c][r].y);
            }

            //actually draw the bricks
            ctx.beginPath();
            if(bricks[c][r].status == 1)ctx.rect(brickX, brickY, brickWidth, brickHeight);  //only draw if it hasnt been hit
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

function collisionDetection(x, y){
    if(ballX +ballRadius < x)    //left
        return false;
    else if(ballX > x+brickWidth)   //right
        return false;
    else if(ballY> y + brickHeight) //below
        return false;
    else if(ballY < y)  //above
        return false;
    return true;
}

function bounceOffBrick(x, y, status){
    //entering from top
    if(ballY + ballRadius >= x && !(prevY + ballRadius > y)){  
        dy = -dy;
    //entering from bottom
    }else if(ballY <= y + brickHeight && !(prevY < y + brickHeight)){ 
        dy = -dy;
    //entering from left
    }else if(ballX + ballRadius >= x && !(prevX + brickWidth > x) ){
        dx = -dx;
    //entering from right
    }else if(ballX <= (x + brickWidth) && !(prevX < x + brickWidth) ){ 
        dx=-dx;
    }else{
       console.log("Didn't meet any of the directional conditions");
    }
}

function setPrev(){
    prevX = ballX;
    prevY = ballY;
}

function setPrevPaddleX(){
    prevPaddleX = paddleX;
}

   
//------------Key Event and Mouse Event Methods------------------
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


//doesnt do anything
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}


//------------Game methods------------------
function checkGameOver(){
    if(bricksRemaining==0){
        alert("YOU WIN, CONGRATULATIONS!");
        document.location.reload();
    }
    if(ballY + ballRadius > canvas.height){
        lives --;
        document.location.reload();
    }
}
//----------------Draw Method-------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    setPrevPaddleX();
    paddleVelocity = paddleX-prevPaddleX;
    //console.log("paddleX: " + paddleX);
    //console.log("prevPaddleX: " + prevPaddleX);
    console.log("paddleVelocity: " + paddleVelocity);
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();

    //ball collides and bounces off
    if(ballX+ballRadius > canvas.width || ballX < 0+ballRadius)
        dx *= -1;
    if(ballY < 0+ballRadius /*|| ballY + ballRadius > canvas.height*/)
        dy *= -1;

    checkGameOver();

    //Collision with paddle
    if(ballX+ballRadius <= paddleX+paddleWidth && ballX+ballRadius >= paddleX  && ballY + ballRadius > canvas.height - paddleY){    //collides if in between the two sides of paddle and is inside paddle
        dy*=-1;
        //caculate paddle velocity 
        dx += paddleVelocity;
    }

    
    //if the arrow key sare pressed move the paddle
    if(rightPressed && paddleX + paddleWidth < canvas.width)
        paddleX += paddleSpeed;
    if(leftPressed && paddleX > 0)
        paddleX -= paddleSpeed;

    //move ball
    setPrev();
    ballX += dx;
    ballY += dy;
}

setInterval(draw, 10);