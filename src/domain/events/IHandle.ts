export interface IHandle<HandleParam = any> {
  setupSubscriptions(): void;
  handle(event: HandleParam): Promise<void>;
}
