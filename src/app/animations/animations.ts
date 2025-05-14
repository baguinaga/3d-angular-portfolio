import {
  animate,
  trigger,
  transition,
  query,
  style,
  keyframes,
} from '@angular/animations';

export const routeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('500ms ease-in-out', style({ opacity: 1 })),
  ]),
]);
