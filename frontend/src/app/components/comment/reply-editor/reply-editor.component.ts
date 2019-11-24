import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuillEditorComponent, QuillModule} from 'ngx-quill';

export interface Data {
  content: string;
  editor: ReplyEditorComponent;
}

@Component({
  selector: 'app-reply-editor',
  templateUrl: './reply-editor.component.html',
  styleUrls: ['./reply-editor.component.scss']
})
export class ReplyEditorComponent extends QuillEditorComponent implements OnInit {

  @Output()
  public save: EventEmitter<Data> = new EventEmitter<Data>();
  @Output()
  public cancel: EventEmitter<ReplyEditorComponent> = new EventEmitter<ReplyEditorComponent>();

  @Input()
  public buttonText: string = 'Reply';
  @Input()
  public content: string = null;

  @Input()
  public format?: 'object' | 'html' | 'text' | 'json';

  private _html: object;
  private _toolbar: string = 'rt_' + Math.random().toString(16).substr(3);

  bounds: string = 'self';
  placeholder: string = 'What are your thoughts?';
  modules: QuillModule = {
    toolbar: '#' + this._toolbar
  };

  ngOnInit(): void {
    this.onContentChanged.subscribe($event => {
      this._html = $event.content;
    });
  }

  public onSave(): void {
    this.save.emit({
      editor: this,
      content: JSON.stringify(this._html)
    });
  }

  public onCancel(): void {
    this.cancel.emit(this);
  }

  public reset(): void {
    this.quillEditor.setText('');
    this._html = null;
  }

  get toolbar(): string {
    return this._toolbar;
  }

  get html(): object {
    return this._html;
  }
}
