const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
let score = 0;
let startTime = Date.now();

const ground = 600;
const gravity = 0.8;
let health = 100;
const healthBarWidth = 50;
const healthBarHeight = 10;
let count = 0;
let zombieVelocity = 0.25;

const idlePos = new Image();
idlePos.src = "normal.png";
const blockImg = new Image();
blockImg.src = "blocks.png";
const zombieImg = new Image();
zombieImg.src = "Zombie.png";

const sheetWidth = 1050;
const sheetHeight = 100;
const frameCount = 7;
const imwidth = 150;
const imHeight = 200;

let currentFrame = 0;
let zcurrentFrame = 0;
let zcount = 0;

class Player {
  constructor(bulletController) {
    this.position = { x: 600, y: 0 };
    this.velocity = { x: 0, y: 1 };
    this.width = 50;
    this.height = 50;
    this.bulletController = bulletController;
    this.direction = "right"; // 'right' or 'left'
  }

  draw() {
    const srcX = currentFrame * 150;
    const srcY = 0;
    c.save();

    if (this.direction === "left") {
      c.scale(-1, 1);
      c.drawImage(
        idlePos,
        srcX,
        srcY,
        150,
        200,
        -this.position.x - 150,
        this.position.y,
        150,
        200
      );
    } else {
      c.drawImage(
        idlePos,
        srcX,
        srcY,
        150,
        200,
        this.position.x,
        this.position.y,
        150,
        200
      );
    }

    c.restore();

    count++;
    if (count > 4) {
      currentFrame++;
      count = 0;
    }
    if (currentFrame >= frameCount) {
      currentFrame = 0;
    }
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y + this.velocity.y + this.height <= canvas.height - 65) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }

    if (this.velocity.x > 0) {
      this.direction = "right";
    } else if (this.velocity.x < 0) {
      this.direction = "left";
    }
  }

  shoot() {
    const speedX = this.direction === "right" ? 15 : -15;
    const speedY = -10;
    const damage = 20;
    const range = 900;
    const bulletX =
      this.direction === "right"
        ? this.position.x + this.width
        : this.position.x;
    const bulletY = this.position.y + this.height / 2;
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
class Zombie {
  constructor(x, y) {
    this.position = { x, y: y - 40 };
    this.health = 100;
    this.healthBar = new ZombieHealthBar(
      this.position.x,
      this.position.y - 10,
      50,
      5,
      this.health,
      "red"
    );
  }

  draw() {
    const ZsrcX = zcurrentFrame * 150;
    c.save();

    if (this.position.x > 500) {
      c.scale(-1, 1);
      c.drawImage(
        zombieImg,
        ZsrcX,
        0,
        150,
        200,
        -this.position.x - 150,
        this.position.y,
        100,
        150
      );
    } else {
      c.drawImage(
        zombieImg,
        ZsrcX,
        0,
        150,
        200,
        this.position.x,
        this.position.y,
        100,
        150
      );
    }

    c.restore();
    this.healthBar.setPosition(this.position.x, this.position.y - 10);
    this.healthBar.show(c);

    zcount++;
    if (zcount > 50) {
      zcurrentFrame++;
      zcount = 0;
    }
    if (zcurrentFrame >= 6) {
      zcurrentFrame = 0;
    }
  }

  update() {
    this.healthBar.setPosition(this.position.x, this.position.y - 10);
    this.healthBar.update(this.health);
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }
}

class Block {
  constructor(x, y, width, height) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
  }

  draw() {
    c.drawImage(
      blockImg,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

const bulletController = new BulletController(canvas);
const player = new Player(bulletController);
const zombies = [new Zombie(0, ground), new Zombie(1200, ground)];

const healthBar = new PlayerHealthBar(
  player.position.x,
  player.position.y - 20,
  healthBarWidth,
  healthBarHeight,
  health,
  "green"
);
const blocks = [
  new Block(400, ground + 30, 80, 60),
  new Block(500, ground + 30, 80, 60),
  new Block(500, ground, 80, 60),
  new Block(800, ground + 30, 80, 60),
  new Block(650, ground + 30, 80, 60),
  new Block(800, ground + 30 - 60, 80, 60),
  new Block(900, ground + 30, 80, 60),
];
const keys = {
  right: { pressed: false },
  left: { pressed: false },
};

function Updatescore() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Timer in seconds
  c.fillStyle = "white";
  c.font = "20px Arial";
  c.fillText(`Score: ${score}`, 1140, 30);
  c.fillText(`Time: 00:0${elapsedTime}`, 1140, 60);
}

function animate() {
  if (health <= 0) {
    setTimeout(() => {
      alert(`Game Over! Your Score is ${score}`);
      restart();
    }, 100);
    return;
  }
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);
  bulletController.update(zombies);
  bulletController.draw();

  blocks.forEach((block) => {
    block.draw();
  });
  player.update();
  zombies.forEach((zombie) => {
    zombie.draw();
    zombie.update();
  });
  if (zombies.length < 3) {
    zombies.push(
      new Zombie(1000, ground),
      new Zombie(1250, ground),
      new Zombie(100, ground),
      new Zombie(200, ground)
    );
    if (zombies.length > 5) {
      health -= 20;
      healthBar.update(health);
    }
  }
  healthBar.setPosition(player.position.x, player.position.y - 20);
  healthBar.show(c);

  if (keys.right.pressed) {
    player.velocity.x = 6;
  } else if (keys.left.pressed) {
    player.velocity.x = -6;
  } else {
    player.velocity.x = 0;
  }

  zombies.forEach((zombie) => {
    if (zombie.position.x > 650) {
      zombie.position.x -= zombieVelocity;
    } else {
      zombie.position.x += zombieVelocity;
    }
  });

  blocks.forEach((block) => {
    if (
      player.position.y + player.height <= block.position.y - 40 &&
      player.position.y + player.height + player.velocity.y >=
        block.position.y - 40 &&
      player.position.x + player.width >= block.position.x - 50 &&
      player.position.x <= block.position.x + block.width - 50
    ) {
      player.velocity.y = 0;
    }
    if (
      player.position.x === block.position.x &&
      player.position.x === block.position.x + block.width
    ) {
      player.velocity.x = 0;
    }
  });
  Updatescore();
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
  const audio = new Audio("jump.mp3");
  audio.play();
}

function shootSound() {
  const audio = new Audio("laser.mp3");
  audio.play();
}

function restart() {
  score = 0;
  startTime = Date.now();
  health = 100;
  player = new Player(bulletController);
  zombies = [new Zombie(0, ground), new Zombie(1200, ground)];
  healthBar = new PlayerHealthBar(
    player.position.x,
    player.position.y - 20,
    healthBarWidth,
    healthBarHeight,
    health,
    "green"
  );
  blocks = [
    new Block(400, ground + 30, 80, 60),
    new Block(500, ground + 30, 80, 60),
    new Block(500, ground, 80, 60),
    new Block(800, ground + 30, 80, 60),
    new Block(650, ground + 30, 80, 60),
    new Block(800, ground + 30 - 60, 80, 60),
    new Block(900, ground + 30, 80, 60),
  ];
}
animate();

document.getElementById("restart").addEventListener("click", restart);
