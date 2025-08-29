if (!('requestAnimationFrame' in window)) {
  // @ts-ignore
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0) as unknown as number;
  // @ts-ignore
  window.cancelAnimationFrame = (id: number) => clearTimeout(id as any);
}
