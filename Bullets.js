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

  update(zombies) {
    this.bullets.forEach((bullet, bulletIndex) => {
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
        bullet.x < 0 ||
        distanceTraveled > bullet.range
      ) {
        this.bullets.splice(bulletIndex, 1);
      }

      // Check for collision with zombies
      zombies.forEach((zombie, zombieIndex) => {
        if (
          bullet.x < zombie.position.x + 100 &&
          bullet.x + 8 > zombie.position.x &&
          bullet.y < zombie.position.y + 100 &&
          bullet.y + 8 > zombie.position.y
        ) {
          // Bullet hit the zombie
          zombie.takeDamage(bullet.damage);
          this.bullets.splice(bulletIndex, 1);

          // Remove the zombie if its health is zero
          if (zombie.health <= 0) {
            zombies.splice(zombieIndex, 1);
            score += 10;
          }
        }
      });
    });
  }

  draw() {
    this.bullets.forEach((bullet) => {
      c.fillStyle = "yellow";
      c.fillRect(bullet.x, bullet.y, 8, 8);
    });
  }
}
