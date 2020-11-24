import { EntityInterface } from './entity';
import { Game } from './game';
import { getTextPoints } from './text';

export class AnimatedText implements EntityInterface {
  finished = false;
  gameScale = true;
  private lastUpdated: number;
  private pointsToRender: Array<[number, number]> = [];
  private readonly points: Array<[number, number]>;
  private readonly animation: TextAnimation;

  constructor(
    private readonly game: Game,
    private readonly color: string,
    private readonly pixelSize: number,
    private readonly texts: Array<[[number, number], string]>
  ) {
    this.lastUpdated = game.now;
    this.points = new Array<[number, number]>().concat.apply(
      [],
      texts.map(t => getTextPoints(t[1], pixelSize, t[0]))
    );
    this.animation = new SinusText(game);
    this.animation.start(this.points);
  }

  update(now: number): void {
    this.lastUpdated = now;
    this.pointsToRender = this.animation.update();
  }

  render(): void {
    const c = this.game.context;
    const s = this.pixelSize;
    c.save();
    c.fillStyle = this.color;
    for (let p of this.pointsToRender) {
      c.fillRect(p[0], p[1], s, s);
      c.fillRect(p[0], p[1], s, s);
    }
    c.restore();
  }
}

export interface TextAnimation {
  start(points: Array<[number, number]>): void;
  update(): Array<[number, number]>;
}

export class SinusText implements TextAnimation {
  private startPoints: Array<[number, number]> = [];
  private points: Array<[number, number]> = [];
  private lastUpdated: number;

  constructor(private readonly game: Game) {
    this.lastUpdated = this.game.now;
  }

  start(points: Array<[number, number]>): void {
    this.lastUpdated = this.game.now;
    this.startPoints = points;
  }

  update(): Array<[number, number]> {
    const delta = this.game.now - this.lastUpdated;
    this.lastUpdated = this.game.now;
    this.points = this.startPoints.map(p => [
      p[0] + Math.sin(this.game.now / 1000) * (p[1] / 5) * Math.cos(this.game.now / 14231),
      p[1] + Math.cos(this.game.now / 1500) * (p[0] / 30) * Math.sin(this.game.now / 13907) * 1.5,
    ]);
    return this.points;
  }
}
