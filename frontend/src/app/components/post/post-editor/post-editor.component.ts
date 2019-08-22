import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {

  private _title: string;
  private _content: string;

  constructor() {
  }

  public ngOnInit(): void {
  }

  onContentChanged($event: any): any {
    this._content = $event.html;
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

}
