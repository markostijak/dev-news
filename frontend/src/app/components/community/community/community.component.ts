import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../../../domain/utils/dialog.service';
import {CreatePostDialogComponent} from '../../post/create-post-dialog/create-post-dialog.component';
import {UserService} from '../../../domain/user/user.service';
import {takeUntil} from 'rxjs/operators';
import {SubscriptionSupport} from '../../../domain/utils/subscription-support';
import {Community} from '../../../domain/community/community';
import {State} from '../../../domain/state';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent extends SubscriptionSupport implements OnInit {

  @Input()
  public community: Community;
  @Input()
  public showCreatePostButton: boolean = true;

  member = false;

  postsCount = 0;
  membersCount = 0;
  state: State;

  private userService: UserService;
  private dialogService: DialogService;

  constructor(dialogService: DialogService, state: State, userService: UserService) {
    super();
    this.state = state;
    this.userService = userService;
    this.dialogService = dialogService;
  }

  public ngOnInit(): void {
    this.state.communities$.pipe(takeUntil(this.destroyed$))
      .subscribe(c => this.member = c && c.some(e => e._links.self.href === this.community._links.self.href));
    // this.communityService.getMembersCount(this.community).subscribe(value => this.membersCount = value);
    // this.communityService.getPostsCount(this.community).subscribe(value => this.postsCount = value);
  }

  public showPostDialog(): void {
    this.dialogService.showDialog(CreatePostDialogComponent);
  }

  public join(): void {
    const communities = this.state.communities || [];
    this.userService.joinCommunity(this.state.user, this.community)
      .subscribe(() => {
        this.membersCount++;
        communities.push(this.community);
        this.state.communities$.next(communities);
      });
  }

  public leave(): void {
    const communities = (this.state.communities || [])
      .filter(c => c._links.self.href !== this.community._links.self.href) as Community[];
    this.userService.updateCommunities(this.state.user, communities)
      .subscribe(() => {
        this.membersCount--;
        this.state.communities$.next(communities);
      });
  }

}
