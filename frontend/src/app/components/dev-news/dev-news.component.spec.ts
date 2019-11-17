import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevNewsComponent } from './dev-news.component';

describe('DevNewsComponent', () => {
  let component: DevNewsComponent;
  let fixture: ComponentFixture<DevNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
