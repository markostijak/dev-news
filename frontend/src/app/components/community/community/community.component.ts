import {Component, Input} from '@angular/core';
import {CommunityService} from '../../../services/community/community.service';
import {Community} from '../../../models/community';
import {DialogService} from '../../../services/dialog/dialog.service';
import {CreatePostDialogComponent} from '../../post/create-post-dialog/create-post-dialog.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent {

  @Input()
  private community: Community;

  private _dialogService: DialogService;
  private _communityService: CommunityService;

  constructor(dialogService: DialogService, communityService: CommunityService) {
    this._dialogService = dialogService;
    this._communityService = communityService;
  }

  public showPostDialog(): void {
    this._dialogService.showDialog(CreatePostDialogComponent);
  }

  public join(): void {

  }

}
