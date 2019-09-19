import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuillEditorComponent, QuillModule} from 'ngx-quill';
import {Comment} from '../../../models/comment';

export interface Data {
  editor: CommentEditorComponent;
  content: string;
}

@Component({
  selector: 'app-comment-editor',
  templateUrl: './comment-editor.component.html',
  styleUrls: ['./comment-editor.component.scss']
})
export class CommentEditorComponent extends QuillEditorComponent implements OnInit {

  @Input()
  private buttonText: string = 'Comment';

  @Output()
  private save: EventEmitter<Data> = new EventEmitter<Data>();

  private _html: string;

  bounds: string = 'self';
  placeholder: string = 'What are your thoughts?';
  modules: QuillModule = {
    toolbar: '#toolbar'
  };

  ngOnInit(): void {
    this.onContentChanged.subscribe($event => {
      this._html = $event.html;
    });
  }

  public onSave(): void {
    if (this._html && this._html.length) {
      this.save.emit({
        editor: this,
        content: this._html
      });
    }
  }

  public reset(): void {
    this.quillEditor.setText('');
  }

  get html(): string {
    return this._html;
  }
}
