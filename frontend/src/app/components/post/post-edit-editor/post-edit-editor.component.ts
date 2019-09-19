import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-post-edit-editor',
  templateUrl: './post-edit-editor.component.html',
  styleUrls: ['./post-edit-editor.component.scss']
})
export class PostEditEditorComponent implements OnInit {

  @Input()
  content: string;

  @Output()
  private save: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  private cancel: EventEmitter<PostEditEditorComponent> = new EventEmitter<PostEditEditorComponent>();

  @ViewChild('editor', {static: false}) editorElem: HTMLElement;

  private _html: string = null;

  ngOnInit(): void {
  }

  onContentChanged($event: any): any {
    this._html = $event.html;
  }

  public onSave(): void {
    if (this._html) {
      this.save.emit(this._html);
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  get html(): string {
    return this._html;
  }

}
