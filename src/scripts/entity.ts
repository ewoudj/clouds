export interface EntityInterface {
  finished: boolean;
  gameScale: boolean;
  update(now: number): void;
  render(): void;
}
