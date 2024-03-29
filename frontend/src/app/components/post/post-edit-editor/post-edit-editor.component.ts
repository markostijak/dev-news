import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-post-edit-editor',
  templateUrl: './post-edit-editor.component.html',
  styleUrls: ['./post-edit-editor.component.scss']
})
export class PostEditEditorComponent implements OnInit {

  @Input()
  public content: string;

  @Output()
  public save: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public cancel: EventEmitter<PostEditEditorComponent> = new EventEmitter<PostEditEditorComponent>();

  @ViewChild('editor', {static: false}) editorElem: HTMLElement;

  private _html: object = null;

  ngOnInit(): void {
  }

  onContentChanged($event: any): any {
    this._html = $event.content;
  }

  public onSave(): void {
    if (this._html) {
      this.save.emit(JSON.stringify(this._html));
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  get html(): object {
    return this._html;
  }

}
