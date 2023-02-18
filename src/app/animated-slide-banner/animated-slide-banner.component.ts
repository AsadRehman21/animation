import { Component } from '@angular/core';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
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
      transition(':enter', [
        style({
          transform: "translateY(-100%)"

        }),
        animate('1s .5ms cubic-bezier(.34,.615,.4,.985)')
      ])

    ]),
    trigger('slideLeft', [
      transition(':enter', [
        style({
          transform: "translateX(-100%)"

        }),
        animate('1s 0.5ms cubic-bezier(.34,.615,.4,.985)')
      ])
    ]),

    trigger('swipeDown', [
      transition(':enter', [
        animate('0.3s ease-in-out'),
        style({
          transform: "translateY(-30%)"

        }),
        group([
          query('@slideUp', animateChild())
        ]),
      ]),
    ]),
    trigger('swipeLeft', [
      transition(':enter', [
        animate('0.3s ease-in-out'),
        style({
          transform: "translateX(-30%)"

        }),
        group([
          query('@slideLeft', animateChild())
        ]),
      ])

    ])


  ]
})
export class AnimatedSlideBannerComponent {
}
