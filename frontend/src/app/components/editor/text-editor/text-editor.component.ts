import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import * as marked from 'marked';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {

  private _value: string;
  private _dialog: MatDialog;
  private _preview: string;

  @Input()
  private _compiled: string;
  @Input()
  private _placeholder: string;
  @Output()
  private _eventEmitter: EventEmitter<string>;

  constructor(dialog: MatDialog) {
    this._dialog = dialog;
    this._eventEmitter = new EventEmitter<string>();
  }

  public showPreview(): void {
    if (this.value) {
      this._preview = marked.parser(marked.lexer(this._value));
    }
  }

  public hidePreview(): void {
    this._preview = null;
  }

  public showDialog(): void {
    this._dialog.open(MarkdownHelpDialogComponent, {
      width: '100%',
      maxWidth: '800px'
    });
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get preview(): string {
    return this._preview;
  }

  set preview(value: string) {
    this._preview = value;
  }

}

@Component({
  selector: 'app-markdown-help-dialog',
  templateUrl: './markdown-help-dialog.component.html',
  styleUrls: ['./markdown-help-dialog.component.scss']
})
export class MarkdownHelpDialogComponent {

  private readonly template: string;
  private readonly preview: string;
  private _dialogRef: MatDialogRef<MarkdownHelpDialogComponent>;

  public constructor(dialogRef: MatDialogRef<MarkdownHelpDialogComponent>) {
    this._dialogRef = dialogRef;
    this.template = this.getTemplate();
    this.preview = marked.parser(marked.lexer(this.template));
  }

  public close(): void {
    this._dialogRef.close();
  }

  // noinspection JSMethodCanBeStatic
  private getTemplate(): string {
    return '' +
      '# Title \n' +
      '## Title\n' +
      '### Title\n' +
      '#### Title\n\n' +

      '**bold**\n\n' +

      '*italic*\n\n' +

      'inline `code`\n\n' +

      '### Code block\n\n' +
      '```\n' +
      'const foo = () => {\n' +
      '    return 1;\n' +
      '}\n' +

      '```\n\n' +

      '#### Unordered list\n\n' +
      '- item 1\n' +
      '* item 2\n\n' +

      '#### Ordered list\n\n' +
      '1. item a\n' +
      '2. item b'
      ;
  }
}
