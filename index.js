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
 * Draw the game.
 */
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  checkCollisions();
  x += dx;
  y += dy;
};

/**
 * Start the game.
 */
const startGame = () => {
  setInterval(draw, 10)
};