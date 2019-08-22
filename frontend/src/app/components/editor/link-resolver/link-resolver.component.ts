import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-link-resolver',
  templateUrl: './link-resolver.component.html',
  styleUrls: ['./link-resolver.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LinkResolverComponent {

  @Output()
  linkResolved: EventEmitter<object>;

  modules: QuillModule = {
    toolbar: false
  };

  constructor() {
    this.linkResolved = new EventEmitter<object>();
  }

  public onContentChanged($event): void {
    this.resolve($event.text);
  }

  private resolve(url: string): void {
    const title = url;
    if (title) {
      this.linkResolved.emit({
        title: title,
        url: url
      });
    }
  }

}
