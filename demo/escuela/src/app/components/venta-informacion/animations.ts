import { trigger, state, style, animate, transition, stagger, query } from '@angular/animations';

export const fadeInAnimation = trigger('fadeInAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms', style({ opacity: 1 })),
  ]),
]);

export const fadeInStaggerAnimation = trigger('fadeInStaggerAnimation', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', [
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ], { optional: true }),
  ]),
]);

export const mobileMenuAnimation = trigger('mobileMenuAnimation', [
  state('closed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
  state('open', style({ height: '*', opacity: 1 })),
  transition('closed <=> open', animate('300ms ease-in-out')),
]);