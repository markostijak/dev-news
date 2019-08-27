import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  templateUrl: './create-community-dialog.component.html',
  styleUrls: ['./create-community-dialog.component.scss']
})
export class CreateCommunityDialogComponent {

  private _dialog: MatDialogRef<CreateCommunityDialogComponent>;

  constructor(dialog: MatDialogRef<CreateCommunityDialogComponent>) {
    this._dialog = dialog;
  }

  public close(): void {
    this._dialog.close();
  }

}
