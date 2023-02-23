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
        transform: 'translateY(-100%)'
      }),
      animate('1s 0.5ms')
      ])

    ]),
    trigger('slideLeft', [
      transition('void => *', [
        style({
          transform: 'translateX(-100%)'
        }),
        animate('1s 0.5ms')
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
