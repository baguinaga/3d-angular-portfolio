export function createInteractionCallbacks(
  canvas: HTMLCanvasElement,
  handlers: Partial<Record<keyof DocumentEventMap, EventListener>>,
): () => void {
  const listeners: Record<string, EventListener> = {};

  // Register event listeners for each handler
  Object.entries(handlers).forEach(([eventName, handler]) => {
    if (handler) {
      listeners[eventName] = handler;
      canvas.addEventListener(eventName as keyof DocumentEventMap, handler);
    }
  });

  // Returns a higher-order function that removes the event listeners
  // when scene is switched (prevents memory leaks and duplicate listeners)
  return () => {
    Object.keys(listeners).forEach((eventName) => {
      canvas.removeEventListener(eventName, listeners[eventName]);
    });
  };
}
