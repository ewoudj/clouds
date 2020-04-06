export interface EntityInterface {
  finished: boolean;
  update(now: number): void;
  render(): void;
}
