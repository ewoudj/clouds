import { EntityInterface } from './entity';
import { Game } from './game';
import { Cloud } from './cloud';

export class CloudField implements EntityInterface {
  finished = false;
  private lastUpdated: number;
  
  constructor(
    private readonly game: Game
  ) {
    this.lastUpdated = game.now;
    // for(let i = 0 ; i < 8; i++){
    //     this.addCloud();
    //   }
  }

  addCloud(): void {
      const entities = this.game.entities;
      let c = new Cloud(this.game);
      let nextCloud = entities.find( e => e instanceof Cloud && e.position[2] < c.position[2]);
      nextCloud ? entities.splice(entities.indexOf(nextCloud),0, c) : entities.push(c);
  }

  update(now: number): void {
    this.lastUpdated = now;
    if(this.rnd(0, 1000) === 6){
        this.addCloud();
    }
  }

  private rnd(min: number, max:number): number{
    return Math.floor(Math.random() * (max - min)) + min;
  }

  render(): void {
    
  }

}
