import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpViewComponent } from './sign-up-view.component';

describe('SignUpComponent', () => {
  let component: SignUpViewComponent;
  let fixture: ComponentFixture<SignUpViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
