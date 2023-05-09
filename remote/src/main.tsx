import('./bootstrap').then(
  ({ mount }) => {
    const localRoot = document.getElementById("root-remote") as HTMLElement

    mount({
      mountPoint: localRoot!,
      routingStrategy: 'browser',
    });
  }
);

export { };