import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsViewComponent } from './user-settings-view.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsViewComponent;
  let fixture: ComponentFixture<UserSettingsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
