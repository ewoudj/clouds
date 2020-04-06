import { EntityInterface } from './entity';
import { Game } from './game';

export class Cloud implements EntityInterface {
  finished = false;
  private lastUpdated: number;
  constructor(
    private readonly game: Game,
    private position: [number, number]
  ) {
    this.lastUpdated = game.now;
  }

  update(now: number): void {
    const dt: number = (now - this.lastUpdated) / 100;
    const w = this.game.logicalWidth;
    const h = this.game.logicalHeight;
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
    c.translate(this.position[0], this.position[1]);
    c.fillStyle = "#FFF";
    c.fillRect(-2.5, -12.5, 5, 25);
    c.fillRect(-12.5, -2.5, 25, 5);
    c.restore();
  }

  private drawRect(position: [number, number]) {
    this.game.context.fillRect(position[0] - 2.5, position[1] - 2.5, 5.5, 5.5);
  }
}
