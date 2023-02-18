import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedSlideBannerComponent } from './animated-slide-banner.component';

describe('AnimatedSlideBannerComponent', () => {
  let component: AnimatedSlideBannerComponent;
  let fixture: ComponentFixture<AnimatedSlideBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedSlideBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedSlideBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
