import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignUpMenuItemComponent } from './login-sign-up-menu-item.component';

describe('LoginSignUpMenuItemComponent', () => {
  let component: LoginSignUpMenuItemComponent;
  let fixture: ComponentFixture<LoginSignUpMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSignUpMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSignUpMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
