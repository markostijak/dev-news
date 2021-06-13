import {Component, OnInit} from '@angular/core';
import {Community} from '../../../domain/community/community';
import {CommunityService} from '../../../domain/community/community.service';
import {State} from '../../../domain/state';
import {map, takeUntil} from 'rxjs/operators';
import {SubscriptionSupport} from '../../../domain/utils/subscription-support';
import {Observable} from 'rxjs';
import {UserService} from '../../../domain/user/user.service';

@Component({
  selector: 'app-trending-communities',
  templateUrl: './trending-communities.component.html',
  styleUrls: ['./trending-communities.component.scss']
})
export class TrendingCommunitiesComponent extends SubscriptionSupport implements OnInit {

  communities: Community[] = [];

  state: State;
  member = false;

  private userService: UserService;
  private communityService: CommunityService;

  constructor(state: State, userService: UserService, communityService: CommunityService) {
    super();
    this.state = state;
    this.userService = userService;
    this.communityService = communityService;
  }

  // public ngOnInit(): void {
  //   this.communityService.fetchTrending().subscribe(communities => {
  //     this.communities = communities;
  //   });
  // }

  ngOnInit(): void {
    this.communityService.fetchUpAndComing({size: '5', projection: 'stats'}).subscribe(communities => {
      this.communities = communities;
    });
  }

  public join(community: Community): void {
    const communities = this.state.communities || [];
    this.userService.joinCommunity(this.state.user, community)
      .subscribe(() => {
        community.membersCount++;
        communities.push(community);
        this.state.communities$.next(communities);
      });
  }

  public leave(community: Community): void {
    const communities = (this.state.communities || [])
      .filter(c => c._links.self.href !== community._links.self.href) as Community[];
    this.userService.updateCommunities(this.state.user, communities)
      .subscribe(() => {
        community.membersCount--;
        this.state.communities$.next(communities);
      });
  }

  public memberOf(community: Community): Observable<boolean> {
    return this.state.communities$.pipe(takeUntil(this.destroyed$))
      .pipe(map(c => this.member = c && c.some(e => e._links.self.href === community._links.self.href)));
  }

}
