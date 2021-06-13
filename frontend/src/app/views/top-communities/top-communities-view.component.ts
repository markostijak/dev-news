import {Component, OnInit} from '@angular/core';
import {State} from '../../domain/state';
import {CommunityService} from '../../domain/community/community.service';
import {Page} from '../../domain/utils/hal';
import {Community} from '../../domain/community/community';
import {TOP_COMMUNITIES} from '../../domain/utils/navigation';

@Component({
  selector: 'app-top-communities-view',
  templateUrl: './top-communities-view.component.html',
  styleUrls: ['./top-communities-view.component.scss']
})
export class TopCommunitiesViewComponent implements OnInit {

  page: Page;
  communities: Community[] = [];

  private state: State;
  private communityService: CommunityService;

  constructor(state: State, communityService: CommunityService) {
    this.state = state;
    this.communityService = communityService;
  }

  ngOnInit(): void {
    this.state.navigation$.next(TOP_COMMUNITIES);
    this.fetchCommunities(0);
  }

  private fetchCommunities(start: number): void {
    this.communityService.fetchPage({
      page: start,
      sort: 'postsCount,desc',
      projection: 'stats'
    }).subscribe(([communities, page]) => {
      this.communities.push(...communities);
      this.page = page;
    });
  }

  public onScroll($event): void {
    if (this.page && (this.page.number + 1 < this.page.totalPages)) {
      this.fetchCommunities(this.page.number + 1);
    }
  }

  navigate(community: Community): void {
    this.state.navigation$.next(community);
  }

}
