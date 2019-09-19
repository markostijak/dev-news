import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-link-resolver',
  templateUrl: './link-resolver.component.html',
  styleUrls: ['./link-resolver.component.scss']
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
    console.log($event.text);
    this.resolve($event.editor, $event.text);
  }

  private resolve(quill: object, url: string): void {
    if (url) {
      // @ts-ignore
      quill.insertEmbed(0, 'image', url);
    }
  }

}
