import { EntityInterface } from './entity';
import { Game } from './game';

let maxRight = 0;

export class Cloud implements EntityInterface {
  finished = false;
  gameScale = true;
  position: [number, number, number];
  private lastUpdated: number;
  private circles: Array<{
    x: number;
    y: number;
    radius: number;
  }> = [];
  private velocity: number = 8;

  constructor(private readonly game: Game, placeRandomOnScreen: boolean = false) {
    this.lastUpdated = game.now;
    const h = game.logicalHeight;
    const w = game.logicalWidth;
    const widthScale = game.canvas.width / w;
    const heightScale = game.canvas.height / h;
    const smallestScale = widthScale < heightScale ? widthScale : heightScale;
    const availablePixels = game.canvas.width / smallestScale;
    this.position = [-(availablePixels / 2) - 320, -300, this.rnd(0, 20) * 100 - 1000];
    const s = (1000 - this.position[2]) / 1000;
    this.position[0] = this.position[0] / (s || 1);
    if (placeRandomOnScreen) {
      this.position[0] = this.rnd(this.position[0], -this.position[0]);
    }
    if (maxRight < -this.position[0]) {
      maxRight = -this.position[0];
    }
    for (let i = 0; i < this.rnd(7, 15); i++) {
      let x = this.rnd(-100, 100);
      let y = this.rnd(0, 20);
      let r = this.rnd(24, 60);
      this.circles.push({
        x: x,
        y: y,
        radius: r,
      });
    }
  }

  private rnd(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  update(now: number): void {
    const game = this.game;
    // If the update was not called for more than a second assume
    // the game was paused, or the user was on a different tab.
    const dt: number =
      game.now - this.lastUpdated < 1000 ? (now - this.lastUpdated) / 1000 : 16 / 1000;
    const w = this.game.logicalWidth;
    const h = this.game.logicalHeight;
    this.position[0] += this.velocity * dt;
    this.finished = this.position[0] > maxRight;
    this.lastUpdated = game.now;
  }

  render(): void {
    const c = this.game.context;
    c.save();
    const s = (1000 - this.position[2]) / 1000;
    c.translate(this.position[0] * s, this.position[1] + this.position[2] / 3);
    c.scale(s, s);
    c.beginPath();
    c.rect(-160, -80, 320, 100);
    c.clip();
    const color = Math.floor(170 + 85 * s);
    c.fillStyle = `rgb(${color}, ${color}, 255)`;
    for (const circle of this.circles) {
      c.beginPath();
      c.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      c.fill();
    }

    c.restore();
  }
}
