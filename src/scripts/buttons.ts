import { EntityInterface } from './entity';
import { Game } from './game';

const iconCache = new Map<string, HTMLImageElement>();

export interface ButtonInterface {
  url: string;
  icon: string;
}

export class Buttons implements EntityInterface {
  availableHeight = 0;
  buttonSize = 0;
  buttonsPerRow = 0;
  buttonUnderMouse: ButtonInterface | undefined;
  offsetLeft = 0;
  offsetTop = 0;
  finished = false;
  gameScale = false;
  highlightGradient: CanvasGradient;
  backlightGradient: CanvasGradient;

  constructor(private readonly game: Game, public readonly buttons: Array<ButtonInterface>) {
    this.buttons.forEach((b, i) => {
      if (!iconCache.has(b.icon)) {
        let image = new Image();
        image.src = b.icon;
        iconCache.set(b.icon, image);
      }
    });
    this.backlightGradient = game.context.createLinearGradient(0, 0, 0, 67);
    this.backlightGradient.addColorStop(0.8, 'rgba(255,255,255, 0.0)');
    this.backlightGradient.addColorStop(1.0, 'rgba(255,255,255, 0.2)');
    this.highlightGradient = game.context.createRadialGradient(
      57 / 2 + 10,
      -10,
      10,
      57 / 2 + 10,
      -25,
      60
    );
    this.highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    this.highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    this.highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    window.addEventListener('mousemove', ev => {
      const x = ev.clientX;
      const y = ev.clientY;
      this.buttonUnderMouse = this.getButton(x, y)
    });
    window.addEventListener('mouseup', ev => {
      if (this.buttonUnderMouse) {
        window.location.href = this.buttonUnderMouse.url;
      }
    });
    window.addEventListener('touchend', ev => {
      for(let i = 0; i < ev.changedTouches.length; i++){
        var b = this.getButton(ev.changedTouches[i].clientX, ev.changedTouches[i].clientY);
        if(b){
          window.location.href = b.url;
        }
      }
    });
  }

  getButton(x: number, y: number): ButtonInterface | undefined {
    let result = undefined;
    this.buttons.forEach((b, i) => {
      const currentRow = Math.floor(i / this.buttonsPerRow);
      const left =
        this.offsetLeft +
        (i * this.buttonSize - currentRow * (this.buttonSize * this.buttonsPerRow));
      const top =
        this.offsetTop +
        (this.game.canvas.height - this.availableHeight + currentRow * this.buttonSize);
      if (x > left && x < left + this.buttonSize && y > top && y < top + this.buttonSize) {
        result = b;
      }
    });
    return result;
  }

  update(now: number): void {
    const mainMargin = 0.9;
    this.availableHeight = this.game.canvas.height * 0.4;
    const availableWidth = this.game.canvas.width;
    this.buttonSize = this.availableHeight;
    let nextButtonSize = this.availableHeight;
    let rowCount = 0;
    do {
      rowCount += 1;
      nextButtonSize = this.availableHeight / rowCount;
    } while (
      nextButtonSize * Math.ceil(this.buttons.length / rowCount) >
      availableWidth * mainMargin
    );
    if (nextButtonSize < this.buttonSize) {
      const previousButtonsPerRow = Math.ceil(this.buttons.length / (rowCount - 1));
      const alternateWidth = (availableWidth * mainMargin) / previousButtonsPerRow;
      if (alternateWidth > nextButtonSize) {
        this.buttonSize = alternateWidth;
        rowCount -= 1;
      } else {
        this.buttonSize = nextButtonSize;
      }
    }
    this.buttonsPerRow = Math.ceil(this.buttons.length / rowCount);
    this.offsetLeft = (availableWidth - this.buttonsPerRow * this.buttonSize) / 2;
    this.offsetTop = (this.availableHeight - rowCount * this.buttonSize) / 2;
  }

  render(): void {
    const c = this.game.context;
    this.buttons.forEach((b, i) => {
      const currentRow = Math.floor(i / this.buttonsPerRow);
      c.save();
      c.translate(
        this.offsetLeft +
          (i * this.buttonSize - currentRow * (this.buttonSize * this.buttonsPerRow)),
        this.offsetTop +
          (this.game.canvas.height - this.availableHeight + currentRow * this.buttonSize)
      );
      c.scale(this.buttonSize / 77, this.buttonSize / 77);
      c.fillStyle = '#000000';
      if (b === this.buttonUnderMouse) {
        c.fillStyle = '#000020';
      }
      this.fillRoundedRect(10, 10, 57, 57, 10);
      c.fillStyle = this.backlightGradient;
      this.fillRoundedRect(10, 10, 57, 57, 10);
      const image = iconCache.get(b.icon);
      if (image && image.complete) {
        c.drawImage(image, 12, 12, 53, 53);
      }
      c.fillStyle = this.highlightGradient;
      this.fillRoundedRect(10, 10, 57, 57, 10);
      c.restore();
    });
  }

  private fillRoundedRect(x: number, y: number, w: number, h: number, r: number): void {
    const c = this.game.context;
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
    c.fill();
  }
}
