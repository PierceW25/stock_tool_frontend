import { trigger, transition, style, animate } from '@angular/animations';

export const myInsertRemoveTrigger = trigger('myInsertRemoveTrigger', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.5s', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('0.5s', style({ opacity: 0 }))
  ])
]);

export type MyInsertRemoveTriggerType = typeof myInsertRemoveTrigger;