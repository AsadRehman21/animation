import { Component } from '@angular/core';
import { animate, animateChild, group, keyframes, query, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-animated-slide-banner',
  templateUrl: './animated-slide-banner.component.html',
  styleUrls: ['./animated-slide-banner.component.css'],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({
          zIndex: -1, transform: "translateX(-100%)"

        }),
        animate('1.5s ease-in-out')
      ])

    ]),
    trigger('slideUp', [
     transition('void => *', [
        style({
        
        }),
        animate('3s 0.5ms', keyframes([
          style({ opacity: '0%', offset: 0 }),
          style({  opacity: '51%', offset: 0.2 }),
          style({ opacity: '100%', offset: 0.5 }),
          style({  opacity: '51%', offset: 1 })
        ]))
      ])

    ]),
    trigger('slideLeft', [
      transition('void => *', [
        style({
        
        }),
        animate('3s 0.5ms', keyframes([
          style({ opacity: '0%', offset: 0 }),
          style({  opacity: '51%', offset: 0.2 }),
          style({ opacity: '100%', offset: 0.5 }),
          style({  opacity: '51%', offset: 1 })
        ]))
      ])
      
    ]),
    trigger('swipeDown', [
      transition(':enter', [
  style({transform: 'translateY(30%)'}),
  animate('0.9s ease-in-out', style({transform: 'translateY(0%)'})),
  group([
    query('@slideUp', animateChild())
  ]),
])
])
    ,
    trigger('swipeLeft', [
        transition(':enter', [
    style({transform: 'translateX(30%)'}),
    animate('0.9s ease-in-out', style({transform: 'translateX(0%)'})),
    group([
      query('@slideLeft', animateChild())
    ]),
  ])
])

  ]
})
export class AnimatedSlideBannerComponent {
}
