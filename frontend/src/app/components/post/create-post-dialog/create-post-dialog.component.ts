import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent {

  private _dialog: MatDialogRef<CreatePostDialogComponent>;

  constructor(dialog: MatDialogRef<CreatePostDialogComponent>) {
    this._dialog = dialog;
  }

  public close(): void {
    this._dialog.close();
  }

}
