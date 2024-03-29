import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuillEditorComponent, QuillModule} from 'ngx-quill';

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
  public buttonText: string = 'Comment';

  @Output()
  public save: EventEmitter<Data> = new EventEmitter<Data>();

  private _html: object;

  bounds: string = 'self';
  placeholder: string = 'What are your thoughts?';
  modules: QuillModule = {
    toolbar: '#toolbar'
  };

  ngOnInit(): void {
    this.onContentChanged.subscribe($event => {
      this._html = $event.content;
    });
  }

  public onSave(): void {
    if (this._html) {
      this.save.emit({
        editor: this,
        content: JSON.stringify(this._html)
      });
    }
  }

  public reset(): void {
    this.quillEditor.setText('');
    this._html = null;
  }

  get html(): object {
    return this._html;
  }
}
