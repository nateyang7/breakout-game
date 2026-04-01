// General settings
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const runButton = document.getElementById('runButton');
runButton.addEventListener('click', () => {
  startGame();
  runButton.disabled = true;
});
const elementsColor = '#0095DD';
let interval = 0;
let score = 0;

// Ball position and movements
const ballRadius = 10;
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
document.addEventListener('keydown', (event) => keyDownHandler(event));
document.addEventListener('keyup', (event) => keyUpHandler(event));

// Bricks configuration
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let isIntact = true;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: isIntact};  // Need enums for brick's status
  }
}

/**
 * Checks if a key is down.
 * @param {*} e  - Event received by a key down.
 */
const keyDownHandler = e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

/**
 * Checks if a key is up.
 * @param {*} e - Event received by a key up.
 */
const keyUpHandler = e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

/**
 * Draw a ball.
 */
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = elementsColor;
  ctx.fill();
  ctx.closePath();
}

/**
 * Draw a paddle.
 */
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = elementsColor;
  ctx.fill();
  ctx.closePath();
}

/**
 * Draw bricks
 */
const drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status) { // Intact brick
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = elementsColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

/**
 * Checks collisions
 */
const checkCollisions = () => {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx; // Collision with left or right
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy; // Collision with the paddle
    } else {
      alert('GAME OVER');
      document.location.reload();
      clearInterval(interval); // Needed for Chrome to end game
    }
  }
}

/**
 * Detect collisions of the ball with bricks.
 */
function collideWithBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r]; // Brick object
      if (b.status) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = !b.status; // Break the brick
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
}

/**
 * Draw the score.
 */
const drawScore = () => {
  ctx.font = '16px Arial';
  ctx.fillStyle = elementsColor;
  ctx.fillText(`Score: ${score}`, 8, 20);
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
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collideWithBricks();
  checkCollisions();
  checkPressedKeys();
  x += dx;
  y += dy;
};

/**
 * Start the game.
 */
const startGame = () => interval = setInterval(draw, 10);