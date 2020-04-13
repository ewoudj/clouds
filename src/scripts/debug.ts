import { EntityInterface } from './entity';
import { Game } from './game';

export class Debug implements EntityInterface {
  finished = false;
  private lastUpdated: number;
  
  constructor(
    private readonly game: Game
  ) {
    this.lastUpdated = game.now;    
  }

  update(now: number): void {
    this.lastUpdated = now;
  }

  render(): void {
    const c = this.game.context;
    c.fillStyle = 'red';
    c.fillRect(0,0, 10,10);

    const game = this.game;
    const h = game.logicalHeight;
    const w = game.logicalWidth;
    const widthScale = game.canvas.width / w;
    const heightScale = game.canvas.height / h;
    const smallestScale = widthScale < heightScale ? widthScale : heightScale;
    const availablePixels = game.canvas.width * game.scale;
    c.fillRect(-availablePixels / 2,0, 10,10);
  }

}
