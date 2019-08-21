import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {

  private _placeholder: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  get placeholder(): boolean {
    return this._placeholder;
  }

  set placeholder(value: boolean) {
    this._placeholder = value;
  }
}
