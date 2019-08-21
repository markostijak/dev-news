import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaUploaderComponent } from './media-uploader.component';

describe('MediaUploaderComponent', () => {
  let component: MediaUploaderComponent;
  let fixture: ComponentFixture<MediaUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
