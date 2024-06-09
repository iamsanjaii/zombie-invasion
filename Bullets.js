class BulletController {
  constructor(canvas) {
    this.canvas = canvas;
    this.bullets = [];
  }

  shoot(x, y, speedX, speedY, damage, range) {
    this.bullets.push({
      x,
      y,
      speedX,
      speedY,
      damage,
      range,
      startX: x,
      startY: y,
    });
  }

  update() {
    this.bullets.forEach((bullet, index) => {
      bullet.x += bullet.speedX;
      bullet.y += bullet.speedY;
      bullet.speedY += gravity; // Apply gravity to the vertical speed

      // Remove bullets that go off the screen or exceed their range
      const distanceTraveled = Math.sqrt(
        (bullet.x - bullet.startX) ** 2 + (bullet.y - bullet.startY) ** 2
      );
      if (
        bullet.y > this.canvas.height ||
        bullet.x > this.canvas.width ||
        distanceTraveled > bullet.range
      ) {
        this.bullets.splice(index, 1);
      }
    });
  }

  draw() {
    this.bullets.forEach((bullet) => {
      c.fillStyle = "red";
      c.fillRect(bullet.x, bullet.y, 5, 5);
    });
  }
}
