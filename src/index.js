class ExampleScene extends Phaser.Scene {
  // Properties
  ball;
  bricks;
  paddle;
  scoreText;
  score = 0;
  lives = 3;
  livesText;
  lifeLostText;
  playing = false;
  startButton;

  // Methods
  preload() {
    this.load.image("ball", "assets/objects/ball.png");
    this.load.image("brick", "assets/objects/brick.png");
    this.load.image("paddle", "assets/objects/paddle.png");
    this.load.spritesheet("wobble", "assets/animations/wobble.png", {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.spritesheet("button", "assets/animations/button.png", {
      frameWidth: 120,
      frameHeight: 40,
    });
  }

  create() {
    // Ball
    this.ball = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      "ball",
    );
    this.physics.add.existing(this.ball);
    this.ball.body.gravity.y;
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1);

    this.ball.anims.create({
      key: "wobble",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers("wobble", {
        frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
      }),
    });

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

    // Score
    this.scoreText = this.add.text(5, 5, "Points: 0", {
      font: "18px Arial",
      color: "#0095dd",
    });

    // Lives
    const textStyle = { font: "18px Arial", fill: "#0095dd" };
    this.livesText = this.add.text(
      this.scale.width - 5,
      5,
      `Lives: ${this.lives}`,
      textStyle,
    );
    this.livesText.setOrigin(1, 0);
    this.lifeLostText = this.add.text(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      "Life lost, click to continue",
      textStyle,
    );
    this.lifeLostText.setOrigin(0.5, 0.5);
    this.lifeLostText.visible = false;

    // Start Button
    this.startButton = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      "button",
      0,
    );
    this.startButton.setInteractive();
    this.startButton.on(
      "pointerover",
      () => {
        this.startButton.setFrame(1);
      },
      this,
    );
    this.startButton.on(
      "pointerdown",
      () => {
        this.startButton.setFrame(2);
      },
      this,
    );
    this.startButton.on(
      "pointerout",
      () => {
        this.startButton.setFrame(0);
      },
      this,
    );
    this.startButton.on(
      "pointerup",
      () => {
        this.startGame();
      },
      this,
    );
  }

  update() {
    // Collision detection
    this.physics.collide(this.ball, this.paddle, (ball, paddle) =>
      this.hitPaddle(ball, paddle),
    );
    this.physics.collide(this.ball, this.bricks, (ball, brick) => this.hitBrick(ball, brick));

    // Paddle controls
    if (this.playing) {
      this.paddle.x = this.input.x || this.scale.width * 0.5;
    }

    // Checks if the ball touch the bottom
    const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
      this.physics.world.bounds,
      this.ball.getBounds(),
    );

    if (ballIsOutOfBounds) {
      this.ballLeaveScreen();
    }

    if (this.bricks.countActive() === 0) {
      alert("You won the game, congratulations!");
      location.reload();
    }
  }

  // Game methods
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

  hitBrick(ball, brick) {
    const destroyTween = this.tweens.add({
      targets: brick,
      ease: "Linear",
      repeat: 0,
      duration: 200,
      props: {
        scaleX: 0,
        scaleY: 0,
      },
      onComplete() {
        brick.destroy();
      },
    });
    destroyTween.play();
    this.score += 10;
    this.scoreText.setText(`Points: ${this.score}`);
  }

  hitPaddle(ball, paddle) {
    this.ball.anims.play("wobble");
    ball.body.velocity.x = -5 * (paddle.x - ball.x);
  }

  ballLeaveScreen() {
    this.lives--;
    if (this.lives > 0) {
      this.livesText.setText(`Lives: ${this.lives}`);
      this.lifeLostText.visible = true;
      this.ball.body.reset(this.scale.width * 0.5, this.scale.height - 25);
      this.input.once(
        "pointerdown",
        () => {
          this.lifeLostText.visible = false;
          this.ball.body.setVelocity(150, -150);
        },
        this,
      );
    } else {
      // Game over logic
      location.reload();
    }
  }

  startGame() {
    this.startButton.destroy();
    this.ball.body.setVelocity(150, -150);
    this.playing = true;
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