import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularViewComponent } from './popular-view.component';

describe('PopularComponent', () => {
  let component: PopularViewComponent;
  let fixture: ComponentFixture<PopularViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
