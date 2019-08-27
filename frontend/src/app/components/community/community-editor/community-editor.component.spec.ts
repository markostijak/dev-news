import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityEditorComponent } from './community-editor.component';

describe('CommunityEditorComponent', () => {
  let component: CommunityEditorComponent;
  let fixture: ComponentFixture<CommunityEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
