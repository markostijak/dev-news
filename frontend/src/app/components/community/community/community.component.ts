import {Component, Input, OnInit} from '@angular/core';
import {CommunityService} from '../../../services/community/community.service';
import {Community} from '../../../models/community';
import {DialogService} from '../../../services/dialog/dialog.service';
import {CreatePostDialogComponent} from '../../post/create-post-dialog/create-post-dialog.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  @Input()
  private community: Community;
  @Input()
  private showCreatePostButton: boolean = true;

  private _member: boolean;
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
    this._communityService.join(this.community).subscribe(() => {
      this._member = true;
      this.community.membersCount++;
    });
  }

  public leave(): void {
    this._communityService.leave(this.community).subscribe(() => {
      this._member = false;
      this.community.membersCount--;
    });
  }

  ngOnInit(): void {
    this._member = this._communityService.memberOf(this.community);
  }

  get member(): boolean {
    return this._member;
  }
}
