class ExampleScene extends Phaser.Scene {
  ball;
  bricks;
  paddle;
  preload() {
    this.load.image("ball", "img/ball.png");
    this.load.image("brick", "img/brick.png");
    this.load.image("paddle", "img/paddle.png");
  }
  create() {
    // Ball
    this.ball = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      "ball",
    );
    this.physics.add.existing(this.ball);
    this.ball.body.setVelocity(150, -150);
    this.ball.body.gravity.y;
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1);

    // Paddle
    this.paddle = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height - 5,
      "paddle",
    );
    this.paddle.setOrigin(0.5, 1);
    this.physics.add.existing(this.paddle);
    this.paddle.body.setImmovable();

    // Game over
    this.physics.world.checkCollision.down = false;

    // Bricks
    this.initBricks();
  }

  update() {
    this.physics.collide(this.ball, this.paddle);

    // Paddle controls
    this.paddle.x = this.input.x || this.scale.width * 0.5;

    // Checks if the ball touch the bottom
    const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
      this.physics.world.bounds,
      this.ball.getBounds(),
    );

    if (ballIsOutOfBounds) {
      // Game over logic
      alert("Game over!");
      location.reload();
    }
  }

  initBricks() {
    const bricksLayout = {
      width: 50,
      height: 20,
      count: {
        row: 3,
        col: 7,
      },
      offset: {
        top: 50,
        left: 50,
      },
      padding: 10,
    };

    this.bricks = this.add.group();

    for (let c = 0; c < bricksLayout.count.col; c++) {
      for (let r = 0; r < bricksLayout.count.row; r++) {
        const brickX = c *
          (bricksLayout.width + bricksLayout.padding) +
          bricksLayout.offset.left;
        const brickY = r *
          (bricksLayout.height + bricksLayout.padding) +
          bricksLayout.offset.top;
        const newBrick = this.add.sprite(brickX, brickY, "brick");
        this.physics.add.existing(newBrick);
        newBrick.body.setImmovable(true);
        this.bricks.add(newBrick);
      }

    }


  }
}

// Display settings
const config = {
  type: Phaser.CANVAS,
  width: 480,
  height: 320,
  scene: ExampleScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#eeeeee",
  physics: {
    default: "arcade",
  }
};

const game = new Phaser.Game(config);