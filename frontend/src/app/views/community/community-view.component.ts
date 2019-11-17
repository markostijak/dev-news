import {Component, OnDestroy, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {NavigationService} from '../../services/navigation/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Post} from '../../models/post';
import {Page} from '../../models/hal';
import {CommunityService} from '../../services/community/community.service';
import {PostService} from '../../services/post/post.service';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit, OnDestroy {

  private _page: Page;
  private _posts: Post[] = [];
  private _community: Community;
  private _trending: Post[] = [];

  private _postService: PostService;
  private _communityService: CommunityService;
  private _navigationService: NavigationService;

  private _loading: boolean = false;
  private _activatedRoute: ActivatedRoute;
  private _subscription: Subscription = new Subscription();

  constructor(postService: PostService,
              activatedRoute: ActivatedRoute,
              communityService: CommunityService,
              navigationService: NavigationService) {
    this._postService = postService;
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
    this._communityService.fetchByAlias(alias, 'include-stats').subscribe(community => {
      this._navigationService.navigate(community);
      this.fetchPosts(community, 0);
      this._postService.fetchTrendingByCommunity(community, 5).subscribe(posts => {
        this._trending = posts;
      });
    });
  }

  private fetchPosts(community: Community, page: number): void {
    if (!this._loading) {
      this._postService.fetchPage('api/v1/posts/search/findAllByCommunity', page, 'include-stats', {
        community: community._links.self.href
      }).subscribe(hal => {
        this._posts.push(...hal._embedded.posts);
        this._community = community;
        this._page = hal.page;
        this._loading = false;
      }, () => this._loading = false);
    }
  }

  public onScrollEnd($event: UIEvent): void {
    if (this._page.number + 1 < this._page.totalPages) {
      this.fetchPosts(this.community, this._page.number + 1);
    }
  }

  get community(): Community {
    return this._community;
  }

  get posts(): Post[] {
    return this._posts;
  }

  get trending(): Post[] {
    return this._trending;
  }

}
