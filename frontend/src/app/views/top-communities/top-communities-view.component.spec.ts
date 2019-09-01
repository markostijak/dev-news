import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCommunitiesViewComponent } from './top-communities-view.component';

describe('TopCommunitiesComponent', () => {
  let component: TopCommunitiesViewComponent;
  let fixture: ComponentFixture<TopCommunitiesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopCommunitiesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCommunitiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
