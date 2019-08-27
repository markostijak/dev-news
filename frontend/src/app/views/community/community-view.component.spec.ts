import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityViewComponent } from './community-view.component';

describe('CommunityComponent', () => {
  let component: CommunityViewComponent;
  let fixture: ComponentFixture<CommunityViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
