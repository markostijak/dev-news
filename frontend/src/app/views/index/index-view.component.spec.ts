import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexViewComponent } from './index-view.component';

describe('IndexComponent', () => {
  let component: IndexViewComponent;
  let fixture: ComponentFixture<IndexViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
