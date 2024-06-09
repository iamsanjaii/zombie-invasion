const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.8;
let health = 100;
const healthBarWidth = 50;
const healthBarHeight = 10;
let count = 0;
let zombieVelocity = 0.25;

var IdlePos = new Image();
IdlePos.src = "normal.png";
var yPos = 512;
var srcX;
var srcY;
var sheetWidth = 1050;
var sheetHeight = 100;
var frameCount = 7;
var imwidth = 150;
var imHeight = 200;
var Currentframe = 0;

var character = new Image();
character.src = "Zombie.png";

class Player {
  constructor(bulletController) {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 50;
    this.height = 50;
    this.bulletController = bulletController;
  }

  draw() {
    srcX = Currentframe * 150;
    srcY = 0;
    c.clearRect(this.position.x, this.position.y, 100, 100);
    c.drawImage(
      IdlePos,
      srcX,
      srcY,
      100,
      100,
      this.position.x,
      this.position.y,
      100,
      100
    );
    count++;
    if (count > 4) {
      Currentframe++;
      count = 0;
    }
    if (Currentframe >= 7) {
      Currentframe = 0;
    }
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y + this.velocity.y + this.height <= canvas.height - 65) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;
  }

  shoot() {
    const speedX = 10; // Horizontal speed of the bullet
    const speedY = -5; // Initial vertical speed of the bullet
    const damage = 1;
    const range = 800; // Range of the bullet in pixels
    const bulletX = this.position.x + this.width;
    const bulletY = this.position.y + 40;
    this.bulletController.shoot(
      bulletX,
      bulletY,
      speedX,
      speedY,
      damage,
      range
    );
  }
}

class Blocks {
  constructor() {
    this.position = {
      x: 300,
      y: 300,
    };
    this.width = 100;
    this.height = 100;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const bulletController = new BulletController(canvas);
const player = new Player(bulletController);
const blocks = new Blocks();
const healthBar = new HealthBar(
  player.position.x,
  player.position.y - 20,
  healthBarWidth,
  healthBarHeight,
  health,
  "green"
);

const keys = {
  right: { pressed: false },
  left: { pressed: false },
};

function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  bulletController.update();
  bulletController.draw();
  blocks.draw();

  healthBar.setPosition(player.position.x, player.position.y - 20);
  healthBar.show(c);

  if (keys.right.pressed) {
    player.velocity.x = 6;
  } else if (keys.left.pressed) {
    player.velocity.x = -6;
  } else {
    player.velocity.x = 0;
  }

  // Collision detection with blocks
  if (
    player.position.y + player.height <= blocks.position.y &&
    player.position.y + player.height + player.velocity.y >=
      blocks.position.y &&
    player.position.x + player.width >= blocks.position.x &&
    player.position.x <= blocks.position.x + blocks.width
  ) {
    player.velocity.y = 0;
  }
}

addEventListener("keydown", function ({ keyCode }) {
  switch (keyCode) {
    case 65:
    case 37:
      keys.left.pressed = true;
      break;
    case 68:
    case 39:
      keys.right.pressed = true;
      break;
    case 38:
    case 87:
      player.velocity.y -= 14;
      jumpSound();
      break;
    case 32:
      player.shoot();
      shootSound();
      break;
  }
});

addEventListener("keyup", function ({ keyCode }) {
  switch (keyCode) {
    case 65:
    case 37:
      keys.left.pressed = false;
      break;
    case 68:
    case 39:
      keys.right.pressed = false;
      break;
  }
});

function jumpSound() {
  var audio = new Audio("jump.mp3");
  audio.play();
}

function shootSound() {
  var audio = new Audio("laser.mp3");
  audio.play();
}

canvas.onclick = function () {
  health -= 10;
  healthBar.update(health);
};

animate();
