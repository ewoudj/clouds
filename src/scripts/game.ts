import { EntityInterface } from './entity';
import { CloudField } from './cloudfield';
import { Debug } from './debug';
import { AnimatedText } from './animatedtext';
import { Background } from './background';
import { Buttons } from './buttons';

export class Game {
  readonly logicalWidth: number = 800;
  readonly logicalHeight: number = 600;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly entities: Array<EntityInterface> = [];
  readonly onResize: { (): void }[] = [];

  private _now: number = 0;
  private _timePauzed: number = 0;
  private _totalTimeInPauze: number = 0;
  private _pauzed: boolean = false;
  private _scale: number = 1;

  get scale(): number {
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
      game.onResize.slice(0).forEach(h => h());
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

    function renderEntity(e: EntityInterface) {
      if (e.gameScale) {
        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);
        c.scale(self.scale, self.scale);
        e.render();
        c.restore();
      } else {
        e.render();
      }
    }

    function animationHandler() {
      window.requestAnimationFrame(animationHandler);
      c.clearRect(0, 0, canvas.width, canvas.height);
      const widthScale = canvas.width / w;
      const heightScale = canvas.height / h;
      self._scale = widthScale < heightScale ? widthScale : heightScale;

      if (!self._pauzed) {
        self._now = Date.now() - self._totalTimeInPauze;
        entities.forEach(e => e.update(self._now));
        entities.forEach(e => renderEntity(e));
        const unFinishedEntities = entities.filter(e => !e.finished);
        while (entities.pop()) {}
        entities.push(...unFinishedEntities);
      } else {
        entities.forEach(e => renderEntity(e));
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

    const s = 10;
    const sc = s * 8;
    const texts: Array<[[number, number], string]> = [
      [[-(2.5 * sc) + s, -(sc * 2)], 'ewoud'],
      [[-(4 * sc) + s, -sc], 'software'],
    ];
    this.entities.push(new Background(this));
    this.entities.push(new CloudField(this));
    this.entities.push(new AnimatedText(this, 'yellow', s, texts));
    this.entities.push(
      new Buttons(this, [
        { url: 'productions/debris/', icon: 'icons/debris.svg' },
        {
          url: 'productions/laserwar/',
          icon: 'icons/laserwar.svg',
        } /*,
      {url:'', icon: 'icons/debris.svg'},
      {url:'', icon: 'icons/debris.svg'},
      {url:'', icon: 'icons/debris.svg'},
      {url:'', icon: 'icons/debris.svg'},
      {url:'', icon: 'icons/debris.svg'},
      {url:'', icon: 'icons/debris.svg'},
      {url:'', icon: 'icons/debris.svg'},
      {url:''},
      {url:''},
      {url:''},
      {url:''},
      {url:''},
      {url:''},
      {url:''},
      {url:''},
      {url:''},
      {url:''}*/,
      ])
    );
    //this.entities.push(new Debug(this));
  }
}
