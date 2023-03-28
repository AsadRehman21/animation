import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedSquaresComponent } from './animated-squares.component';

describe('AnimatedSquaresComponent', () => {
  let component: AnimatedSquaresComponent;
  let fixture: ComponentFixture<AnimatedSquaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedSquaresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedSquaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
