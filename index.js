// General settings
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const runButton = document.getElementById('runButton');
runButton.addEventListener('click', () => {
  startGame();
  runButton.disabled = true;
});
const elementsColor = '#0095DD';
const gameFont = '16px Arial';
let spacebarPressed = false;
let interval = 0;
let score = 0;
let lives = 3;

// Ball
let ball = {
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 4,
  dy: -4,
  color: 'red'
};

// Paddle
let paddle = {
  width: 75,
  height: 10,
  x: 0,
  color: 'blue'
};

paddle.x = (canvas.width - paddle.width) / 2;

// Paddle controls
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', event => keyDownHandler(event));
document.addEventListener('keyup', event => keyUpHandler(event));
document.addEventListener('mousemove', event => mouseMoveHandler(event));

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
for (let column = 0; column < brickColumnCount; column++) {
  bricks[column] = [];
  for (let row = 0; row < brickRowCount; row++) {
    bricks[column][row] = { x: 0, y: 0, status: isIntact };
  }
}

/**
 * Checks if a key is down.
 * @param { Event } e  - Event received by a key down.
 * @returns { void } Modifies the state of the pressed keys.
 */
const keyDownHandler = e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (e.key === 'spacebar') {
    spacebarPressed = true;
  }
}

/**
 * Checks if a key is up.
 * @param { Event } e - Event received by a key up.
 * @return { void } Modifies the state of the pressed keys.
 */
const keyUpHandler = e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  } else if (e.key === 'spacebar') {
    spacebarPressed = false;
  }
}

/**
 * Checks if the mouse is moved.
 * @param { Event } e - Event received by a mouse move.
 * @return { void } Modifies the position of the paddle.
 */
const mouseMoveHandler = e => {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2
  }
}

/**
 * Draw a ball.
 * @return { void } Draws a ball on the canvas.
 */
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

/**
 * Draw a paddle.
 * @return { void } Draws a paddle on the canvas.
 */
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width,
    paddle.height);
  ctx.fillStyle = paddle.color;
  ctx.fill();
  ctx.closePath();
}

/**
 * Draw bricks
 * @return { void } Draws bricks on the canvas.
 */
const drawBricks = () => {
  for (let column = 0; column < brickColumnCount; column++) {
    for (let row = 0; row < brickRowCount; row++) {
      if (bricks[column][row].status) { // Intact brick
        const brickX = column * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[column][row].x = brickX;
        bricks[column][row].y = brickY;
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
 * Checks collisions of the ball with the walls and the paddle.
 * @return { void } Modifies the direction of the ball and the state of the game.
 */
const checkCollisions = () => {
  if (ball.x + ball.dx > canvas.width - ball.radius ||
    ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx; // Collision with left or right
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy; // Collision with the paddle
    } else {
      lives--;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        paddle.x = (canvas.width - paddle.width) / 2;
      }
    }
  }
}

/**
 * Detect collisions of the ball with bricks.
 * @return { void } Modifies the status of the bricks and the score.
 */
function collideWithBricks() {
  for (let column = 0; column < brickColumnCount; column++) {
    for (let row = 0; row < brickRowCount; row++) {
      const b = bricks[column][row]; // Brick object
      if (b.status) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = false;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
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
 * Draw lives.
 * @return { void } Draws the number of lives on the canvas.
 */
const drawLives = () => {
  ctx.font = gameFont;
  ctx.fillStyle = elementsColor;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

/**
 * Checks pressed keys.
 * @return { void } Modifies the state of the pressed keys.
 */
const checkPressedKeys = () => {
  if (rightPressed) {
    paddle.x = Math.min(paddle.x + 7, canvas.width - paddle.width);
  } else if (leftPressed) {
    paddle.x = Math.max(paddle.x - 7, 0);
  } else if (spacebarPressed) {
    startGame();
  }
}

/**
 * Draw the game. 
 * @return { void } Draws the game on the canvas and updates the state of the game.
 */
const draw = () => {
  const functions = [
    drawBricks, drawBall, drawPaddle, drawScore, drawLives,
    collideWithBricks, checkCollisions, checkPressedKeys
  ];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  functions.forEach(func => func());

  // Ball keep moving
  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(draw);
};

/**
 * Start the game.
 * @return { void } Starts the game by calling the draw function.
 */
const startGame = () => draw();