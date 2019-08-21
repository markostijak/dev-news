import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkResolverComponent } from './link-resolver.component';

describe('LinkResolverComponent', () => {
  let component: LinkResolverComponent;
  let fixture: ComponentFixture<LinkResolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkResolverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
