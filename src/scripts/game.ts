import { EntityInterface } from './entity';
import { Cloud } from './cloud';
import { CloudField } from './cloudfield';
import { Debug } from './debug';

export class Game {
  readonly logicalWidth: number = 800;
  readonly logicalHeight: number = 600;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly entities: Array<EntityInterface> = [];

  private _now: number = 0;
  private _timePauzed: number = 0;
  private _totalTimeInPauze: number = 0;
  private _pauzed: boolean = false;
  private _scale: number = 1;

  get scale():number {
    return this._scale;
  }

  public constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    document.ontouchmove = function(e) {
      e.preventDefault();
    };
    document.body.addEventListener(
      'touchmove',
      function(event) {
        event.preventDefault();
      },
      {
        passive: false,
        capture: false,
      }
    );
    container.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d') || new CanvasRenderingContext2D();
    this.initializeScalingAndPositioning();
    this.initializeGame();
  }

  get now(): number {
    return this._now;
  }

  public initializeScalingAndPositioning() {
    const game = this;

    function resizeHandler() {
      const c = game.canvas;
      const h = game.logicalHeight;
      const w = game.logicalWidth;
      c.width = document.body.clientWidth;
      c.height = document.body.clientHeight;
      // game.context.beginPath();
      // game.context.rect(0, 0, w, h);
      // game.context.clip();
    }

    window.addEventListener('resize', resizeHandler);
    resizeHandler();
  }

  public initializeGame() {
    const canvas = this.canvas;
    const c = this.context;
    const h = this.logicalHeight;
    const w = this.logicalWidth;
    const entities = this.entities;
    const self = this;

    this.initializeEntities();

    function animationHandler() {
      window.requestAnimationFrame(animationHandler);
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.save();
      const widthScale = canvas.width / w;
      const heightScale = canvas.height / h;
      self._scale = widthScale < heightScale ? widthScale : heightScale;
      c.translate( canvas.width / 2, canvas.height / 2); ///*(canvas.width - w * smallestScale) / 2*/, 0);
      c.scale(self.scale, self.scale);
      if (!self._pauzed) {
        self._now = Date.now() - self._totalTimeInPauze;
        entities.forEach(e => e.update(self._now));
        entities.forEach(e => e.render());
        const unFinishedEntities = entities.filter(e => !e.finished);
        while (entities.pop()) {}
        entities.push(...unFinishedEntities);
      } else {
        entities.forEach(e => e.render());
      }
      c.restore();
    }
    animationHandler();
  }

  public togglePauze() {
    this._pauzed = !this._pauzed;
    if (this._pauzed) {
      this._timePauzed = Date.now();
    } else {
      this._totalTimeInPauze += Date.now() - this._timePauzed;
    }
  }

  public initializeEntities() {
    while (this.entities.pop()) {}
    this._now = Date.now();
    this._totalTimeInPauze = 0;
    this._pauzed = false;
    this.entities.push(new CloudField(this));
    this.entities.push(new Debug(this));
  }
}
