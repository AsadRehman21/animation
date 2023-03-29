import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-animated-squares',
  templateUrl: './animated-squares.component.html',
  styleUrls: ['./animated-squares.component.css'],
  animations: [
    trigger('slideRight', [
    transition(':enter', [
      style({
        transform: 'translateX(-102%)'
      }),
      animate('1.1s .4s cubic-bezier(0.34, 0.615, 0.4, 0.98)', style({transform: 'translateX(0%)'}))
    ])

    ]),

    trigger('slideUp', [
      transition(':enter', [
        style({
          transform: 'translateY(20rem)',opacity:0
        }),
        animate('1.8s .0s cubic-bezier(.34,.615,.4,.985)', style({transform: 'translateY(0rem)',opacity:1}))
      ])
  
      ]),
      trigger('slideDown', [
        transition(':enter', [
          style({
            transform: 'translateY(-102%)'
          }),
          animate('1.1s .6s cubic-bezier(0.34, 0.615, 0.4, 0.98)', style({transform: 'translateY(0%)'}))
        ])
    
        ]),
        
    trigger('slideUpText', [
      transition(':enter', [
        style({
          transform: 'translateY(20rem)',opacity:0
        }),
        animate('.8s .1s cubic-bezier(.34,.615,.4,.985)', style({transform: 'translateY(0rem)',opacity:1}))
      ])
  
      ])
    

  ]
})
export class AnimatedSquaresComponent {

}
