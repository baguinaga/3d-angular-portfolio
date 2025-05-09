import { InteractiveCallbacks } from '../types/scene.types';

export function createInteractionCallbacks(
  canvas: HTMLCanvasElement,
  callbacks: InteractiveCallbacks,
): () => void {
  const listeners: { [key: string]: EventListener } = {};

  // Register event listeners for each mouse event : callback pair
  // listeners object stores the event listeners to be removed later
  Object.keys(callbacks).forEach((eventName) => {
    listeners[eventName] = ((event: Event) => {
      callbacks[eventName]!(event);
    }) as EventListener;

    canvas.addEventListener(eventName, listeners[eventName]);
  });

  // Returns a higher-order function that removes the event listeners
  // when scene is switched (prevents memory leaks and duplicate listeners)
  return () => {
    Object.keys(listeners).forEach((eventName) => {
      canvas.removeEventListener(eventName, listeners[eventName]);
    });
  };
}
