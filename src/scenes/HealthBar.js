import * as Phaser from 'phaser';

export class HealthBar {

  constructor (scene, x, y, width, hp)
  {
      this.bar = new Phaser.GameObjects.Graphics(scene);
      this.x = x;
      this.y = y;
      this.width = width;
      this.hp = hp;
      this.maxHp = hp;

      this.healthLabel = scene.add.text(x, y-50, hp, { font: '32px Arial', fill: '#ffffff' });

      this.draw();

      scene.add.existing(this.bar);
  }

  decrease (amount)
  {
      if(this.hp < 0.1) return;
      this.hp -= amount;

      this.hp = Math.max(this.hp, 0);
      this.hp = Math.min(this.hp, 1000);

      this.draw();
  }

  draw ()
  {
      this.bar.clear();

      //  BG
      this.bar.fillStyle(0x000000);
      this.bar.fillRect(this.x, this.y, this.width+4, 8);

      //  Health
      this.bar.fillStyle(0xffffff);
      this.bar.fillRect(this.x + 2, this.y + 2, this.width, 4);

      if (this.hp < this.maxHp/3)
      {
          this.bar.fillStyle(0xff0000);
      }
      else
      {
          this.bar.fillStyle(0x00ff00);
      }

      var d = Math.floor(this.hp*this.width/this.maxHp);

      this.healthLabel.text = this.hp;
      this.bar.fillRect(this.x + 2, this.y + 2, d, 4);
  }

  getHp() {
    return this.hp;
  }

  hideHealthBar() {
    this.bar.clear();
    this.healthLabel.destroy();
  }
}