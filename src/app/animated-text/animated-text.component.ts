import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-animated-text',
  templateUrl: './animated-text.component.html',
  styleUrls: ['./animated-text.component.css'],
  animations: [
    trigger('slideUp', [
      state(':leave', style({transform: 'translateY(0rem)', opacity: '1'})),
    transition(':enter', [
      style({
        transform: 'translateY(2rem)',  opacity: '0'
      }),
      animate('1s .6s cubic-bezier(.34,.615,.4,.985)', style({transform: 'translateY(0rem)', opacity: '1'}))
    ])

    ])


  ]
})

export class AnimatedTextComponent {

}
