import {
  animate,
  trigger,
  transition,
  query,
  style,
  keyframes,
} from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translate(0, 20%)' }),
        animate(
          '600ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translate(0, -20%)' }),
            style({ opacity: 1, transform: 'translate(0, 0)' }),
          ])
        ),
      ],
      { optional: true }
    ),
  ]),
]);
