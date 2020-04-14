import { EntityInterface } from './entity';
import { Game } from './game';

export class Cloud implements EntityInterface {
  finished = false;
  position: [number, number, number];
  private lastUpdated: number;
  private circles: Array<{
    x: number,
    y: number,
    radius: number
  }> = [];
  private velocity: number = 8;

  constructor(
    private readonly game: Game
  ) {
    this.lastUpdated = game.now;
    const h = game.logicalHeight;
    const w = game.logicalWidth;
    const widthScale = game.canvas.width / w;
    const heightScale = game.canvas.height / h;
    const smallestScale = widthScale < heightScale ? widthScale : heightScale;
    const availablePixels = game.canvas.width / smallestScale;
    this.position = [-(availablePixels / 2) - 320, -300, this.rnd(0, 1000)];
    this.position[0] -= (this.position[2] / 3);
    //this.position=[-400,0,500];
    for(let i = 0; i < this.rnd(7, 15); i++){
      let x = this.rnd(-100, 100);
      let y = this.rnd(0, 20);
      let r = this.rnd(24, 60);
      this.circles.push({
        x: x,
        y: y,
        radius: r
      });
    }
  }

  private rnd(min: number, max:number): number{
    return Math.floor(Math.random() * (max - min)) + min;
  }

  update(now: number): void {
    const dt: number = (now - this.lastUpdated) / 1000;
    const w = this.game.logicalWidth;
    const h = this.game.logicalHeight;
    this.position[0] += this.velocity * dt;
    // if (
    //   (b.position[0] < -d && b.velocity[0] < 0) ||
    //   (b.position[1] < -d && b.velocity[1] < 0) ||
    //   (b.position[0] > w + d && b.velocity[0] > 0) ||
    //   (b.position[1] > h + d && b.velocity[1] > 0)
    // ) {
    //   this.finished = true;
    // }
    this.lastUpdated = now;
  }

  render(): void {
    const c = this.game.context;
    c.save();
    const s = (1000 - this.position[2])/ 1000;
    c.translate(this.position[0] * s, this.position[1] + (this.position[2] / 3));
    
    c.scale( s, s );
    // c.fillStyle = "yellow";
    // c.fillRect(-160, -80, 320, 100);
    c.beginPath();
    c.rect(-160, -80, 320, 100);
    c.clip();
    const color = Math.floor(170 + (85 * s));
    c.fillStyle = `rgb(${color}, ${color}, 255)`;
    for(const circle of this.circles){
      c.beginPath();
      c.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      c.fill();
    }
    
    c.restore();
  }

}
