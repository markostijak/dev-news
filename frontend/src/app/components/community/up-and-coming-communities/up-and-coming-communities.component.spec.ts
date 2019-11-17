import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpAndComingCommunitiesComponent } from './up-and-coming-communities.component';

describe('UpAndComingCommunitiesComponent', () => {
  let component: UpAndComingCommunitiesComponent;
  let fixture: ComponentFixture<UpAndComingCommunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpAndComingCommunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpAndComingCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
