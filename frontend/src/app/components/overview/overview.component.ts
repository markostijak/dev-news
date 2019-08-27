import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CreatePostDialogComponent} from '../post/create-post-dialog/create-post-dialog.component';
import {CreateCommunityDialogComponent} from '../community/create-community-dialog/create-community-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  @Input()
  private title: string;

  private _dialog: MatDialog;

  constructor(dialog: MatDialog) {
    this._dialog = dialog;
  }

  showPostDialog(): void {
    this._dialog.open(CreatePostDialogComponent, {
      width: '100%',
      maxWidth: '600px'
    });
  }

  showCommunityDialog(): void {
    this._dialog.open(CreateCommunityDialogComponent, {
      width: '100%',
      maxWidth: '600px'
    });
  }

}
