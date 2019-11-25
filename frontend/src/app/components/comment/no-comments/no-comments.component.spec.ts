import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCommentsComponent } from './no-comments.component';

describe('NoCommentsComponent', () => {
  let component: NoCommentsComponent;
  let fixture: ComponentFixture<NoCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
