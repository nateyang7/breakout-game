const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const runButton = document.getElementById('runButton');
runButton.addEventListener('click', () => {
  startGame();
  runButton.disabled = true;
});

// Ball position and movements
const ballRadius = 10;
let ballColor = '#0095DD';
let dx = 2;
let dy = -2;
let x = canvas.width / 2;
let y = canvas.height - 30;

// Paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Paddle controls
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
};

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
};

/**
 * Draw a ball.
 */
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

/**
 * Draw a paddle.
 */
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

/**
 * Checks collisions
 */
const checkCollisions = () => {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx; // Collision with left or right
  }
  if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
    dy = -dy; // Collision with top or bottom
  }
}

/**
 * Checks pressed keys.
 */
const checkPressedKeys = () => {
  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }
}

/**
 * Draw the game.
 */
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  checkCollisions();
  checkPressedKeys();
  x += dx;
  y += dy;
};

/**
 * Start the game.
 */
const startGame = () => setInterval(draw, 10);