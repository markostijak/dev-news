import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditEditorComponent } from './post-edit-editor.component';

describe('PostEditEditorComponent', () => {
  let component: PostEditEditorComponent;
  let fixture: ComponentFixture<PostEditEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostEditEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEditEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
