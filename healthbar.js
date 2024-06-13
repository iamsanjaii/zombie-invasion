class PlayerHealthBar {
  constructor(x, y, width, height, health, color) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.health = health;
    this.color = color;
  }

  setPosition(x, y) {
    this.position.x = x + 35;
    this.position.y = y;
  }

  update(health) {
    this.health = health;
  }

  show(c) {
    c.fillStyle = this.color;
    c.fillRect(
      this.position.x,
      this.position.y,
      this.width * (this.health / 100),
      this.height
    );
  }
}
class ZombieHealthBar {
  constructor(x, y, width, height, health, color) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.health = health;
    this.color = color;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  update(health) {
    this.health = health;
  }

  show(c) {
    c.fillStyle = this.color;
    c.fillRect(
      this.position.x,
      this.position.y,
      this.width * (this.health / 100),
      this.height
    );
  }
}
