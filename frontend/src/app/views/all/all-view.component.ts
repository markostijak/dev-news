import {Component, OnInit} from '@angular/core';
import {ALL, NavigationService} from '../../services/navigation/navigation.service';
import {Post} from '../../models/post';
import {Page} from '../../models/hal';
import {PostService} from '../../services/post/post.service';
import {CommunityService} from '../../services/community/community.service';
import {Community} from '../../models/community';

@Component({
  selector: 'app-all-view',
  templateUrl: './all-view.component.html',
  styleUrls: ['./all-view.component.scss']
})
export class AllViewComponent implements OnInit {

  private _page: Page;
  private _posts: Post[] = [];
  private _loading: boolean = false;
  private _trendingPosts: Post[] = [];
  private _trendingCommunities: Community[] = [];
  private _upAndComingCommunities: Community[] = [];

  private _postService: PostService;
  private _communityService: CommunityService;
  private _navigationService: NavigationService;

  constructor(postService: PostService, communityService: CommunityService, navigationService: NavigationService) {
    this._postService = postService;
    this._communityService = communityService;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(ALL);

    this._communityService.fetchTrending().subscribe(communities => {
      this._trendingCommunities = communities;
    });

    this._communityService.fetchUpAndComing().subscribe(communities => {
      this._upAndComingCommunities = communities;
    });

    this._postService.fetchTrending().subscribe(posts => {
      this._trendingPosts = posts;
    });

    this.fetchPosts(0);
  }

  public fetchPosts(page: number): void {
    if (!this._loading) {
      this._loading = true;
      this._postService.fetchPage('api/v1/posts', page, 'include-stats').subscribe(response => {
        this._posts.push(...response._embedded.posts);
        this._page = response.page;
        this._loading = false;
      }, () => this._loading = false);
    }
  }

  public onScrollEnd($event: UIEvent): void {
    if (this._page.number + 1 < this._page.totalPages) {
      this.fetchPosts(this._page.number + 1);
    }
  }

  get posts(): Post[] {
    return this._posts;
  }

  get trendingCommunities(): Community[] {
    return this._trendingCommunities;
  }

  get trendingPosts(): Post[] {
    return this._trendingPosts;
  }

  get upAndComingCommunities(): Community[] {
    return this._upAndComingCommunities;
  }
}
