import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CreatePostDialogComponent} from '../../post/create-post-dialog/create-post-dialog.component';
import {CommunityService} from '../../../services/community/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent {

  @Input()
  private title: string;

  private _dialog: MatDialog;
  private _communityService: CommunityService;

  constructor(communityService: CommunityService, dialog: MatDialog) {
    this._dialog = dialog;
    this._communityService = communityService;
  }

  public showPostDialog(): void {
    this._dialog.open(CreatePostDialogComponent, {
      width: '100%',
      maxWidth: '600px%'
    });
  }

  public join(): void {

  }

}
