import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {

  private _title: string;
  private _content: string;
  private _community: string;

  @Output()
  private save: EventEmitter<any>;

  @Output()
  private discard: EventEmitter<any>;

  constructor() {
    this.save = new EventEmitter<any>();
    this.discard = new EventEmitter<any>();
  }

  public ngOnInit(): void {
  }

  onContentChanged($event: any): any {
    this._content = $event.html;
  }

  onSave(): any {
    this.save.emit({
      post: {
        title: this.title,
        community: this.community,
        content: this.content
      }
    });
  }

  onDiscard(): any {
    this.discard.emit();
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get content(): string {
    return this._content;
  }

  public set content(value: string) {
    this._content = value;
  }

  get community(): string {
    return this._community;
  }

  set community(value: string) {
    this._community = value;
  }

}
