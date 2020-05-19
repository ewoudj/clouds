import { EntityInterface } from './entity';
import { Game } from './game';
import { getTextPoints } from './text';

export class AnimatedText implements EntityInterface {
  finished = false;
  private lastUpdated: number;
  private readonly points: Array<[number, number]>;

  constructor(
    private readonly game: Game,
    private readonly color: string,
    private readonly pixelSize: number,
    private readonly texts: Array<[[number, number], string]>
  ) {
    this.lastUpdated = game.now;
    this.points = new Array<[number, number]>().concat.apply([], 
        texts.map( t => getTextPoints( t[1], pixelSize, t[0]) ));
  }

  update(now: number): void {
    this.lastUpdated = now;
  }

  render(): void {
    
  }

}
