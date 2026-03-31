const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const runButton = document.getElementById('runButton');
runButton.addEventListener('click', () => {
  startGame();
  runButton.disabled = true;
});

// Ball position and movements
let x = canvas.width / 2;
let y = canvas.height - 30;
const dx = 1;
const dy = -1;

/**
 * Draw a ball.
 */
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

/**
 * Draw the game.
 */
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  x += dx;
  y += dy;
};

/**
 * Start the game.
 */
const startGame = () => {
  setInterval(draw, 10)
};