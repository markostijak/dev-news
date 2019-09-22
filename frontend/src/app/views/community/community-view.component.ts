import {Component, OnDestroy, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {NavigationService} from '../../services/navigation/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {Post} from '../../models/post';
import {Hal, Page} from '../../models/hal';
import {CommunityService} from '../../services/community/community.service';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit, OnDestroy {

  private _page: Page;
  private _posts: Post[] = [];
  private _community: Community;

  private _activatedRoute: ActivatedRoute;
  private _communityService: CommunityService;
  private _navigationService: NavigationService;

  private _subscription: Subscription = new Subscription();

  constructor(navigationService: NavigationService, activatedRoute: ActivatedRoute, communityService: CommunityService) {
    this._activatedRoute = activatedRoute;
    this._communityService = communityService;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._subscription.add(this._activatedRoute.params.subscribe(params => {
      this._community = null;
      this._page = null;
      this._posts = [];
      this.reload(params['community']);
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private reload(alias: string): void {
    this._communityService.fetchByAlias('/api/v1/communities/search/findByAlias', alias, 'include-stats')
      .subscribe(community => {
        this._navigationService.navigate(community);
        this.fetchPosts(community, 0).subscribe(hal => {
          this._posts.push(...hal._embedded.posts);
          this._community = community;
          this._page = hal.page;
        });
      });
  }

  private fetchPosts(community: Community, page: number): Observable<Hal<Post[]>> {
    return this._communityService.fetchPosts(community._links.self.href, {number: page} as Page, 'include-stats');
  }

  get community(): Community {
    return this._community;
  }

  get posts(): Post[] {
    return this._posts;
  }

}
