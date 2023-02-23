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
      state('void', style({width: '100%', height: '100%'})),
    state('*', style({width: '100%', height: '100%'})),
    transition(':enter', [
      style({
        transform: 'translateY(-100%)',  visibility: 'hidden'
      }),
      animate('1s 0.5ms', style({transform: 'translateY(0%)', visibility: 'visible'}))
    ])

    ]),
    trigger('slideLeft', [
      state('void', style({width: '100%', height: '100%'})),
      state('*', style({width: '100%', height: '100%'})),
      transition(':enter', [
        style({
          transform: 'translateX(-100%)',  visibility: 'hidden'
        }),
        animate('1s 0.5ms', style({transform: 'translateX(0%)', visibility: 'visible'}))
      ])
      
    ]),
    trigger('swipeDown', [
      transition(':enter', [
  style({transform: 'translateY(30%)',overflow: 'hidden'}),
  animate('0.9s ease-in-out', style({transform: 'translateY(0%)'})),
  group([
    query('@slideUp', animateChild())
  ]),
])
])
    ,
    trigger('swipeLeft', [
        transition(':enter', [
    style({transform: 'translateX(30%)',overflow: 'hidden'}),
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
