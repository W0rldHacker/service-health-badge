export {};

declare global {
  interface Window {
    __fetchCount: number;
    __getFetchCount: () => number;
  }
}
