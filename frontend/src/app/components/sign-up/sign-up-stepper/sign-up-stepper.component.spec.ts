import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepperComponent } from './sign-up-stepper.component';

describe('SignUpStepperComponent', () => {
  let component: SignUpStepperComponent;
  let fixture: ComponentFixture<SignUpStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
