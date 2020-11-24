import { EntityInterface } from './entity';
import { Game } from './game';

export class Background implements EntityInterface {
  finished = false;
  gameScale = false;
  private skyGradient: CanvasGradient;
  private grassGradient: CanvasGradient;

  constructor(private readonly game: Game) {
    this.skyGradient = game.context.createLinearGradient(0, 0, 0, 0);
    this.grassGradient = game.context.createLinearGradient(0, 0, 0, 0);

    const self = this;

    function resizeHandler() {
      const c = game.canvas;
      self.skyGradient = game.context.createLinearGradient(0, 0, 0, c.height);
      self.skyGradient.addColorStop(0, '#8A8AFF');
      self.skyGradient.addColorStop(0.7, '#B0B0FF');
      self.grassGradient = game.context.createRadialGradient(
        c.width * 0.3,
        c.height * 0.8,
        100 * game.scale,
        c.width * 0.6,
        c.height * 0.9,
        c.width
      );
      self.grassGradient.addColorStop(0, '#609000');
      self.grassGradient.addColorStop(1, '#006000');
    }
    game.onResize.push(resizeHandler);
    resizeHandler();
  }

  update(now: number): void {}

  render(): void {
    const game = this.game;
    const c = game.context;
    const canvas = game.canvas;
    c.save();
    c.fillStyle = this.skyGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    c.fillStyle = this.grassGradient;
    var g = canvas.height * 0.6;
    c.moveTo(0, g);
    c.bezierCurveTo(
      canvas.width * 0.2,
      g - 60 * game.scale,
      canvas.width * 0.4,
      g - 60 * game.scale,
      canvas.width,
      g + 50 * game.scale
    );
    c.lineTo(canvas.width, canvas.height);
    c.lineTo(0, canvas.height);
    c.lineTo(0, g);
    c.fill();
    c.restore();
  }
}
