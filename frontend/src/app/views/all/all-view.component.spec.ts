import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllViewComponent } from './all-view.component';

describe('AllComponent', () => {
  let component: AllViewComponent;
  let fixture: ComponentFixture<AllViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
