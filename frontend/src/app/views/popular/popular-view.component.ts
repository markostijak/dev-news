import {Component, OnInit} from '@angular/core';
import {NavigationService, POPULAR} from '../../services/navigation/navigation.service';
import {Page} from '../../models/hal';
import {Post} from '../../models/post';
import {CommunityService} from '../../services/community/community.service';
import {Community} from '../../models/community';
import {PostService} from '../../services/post/post.service';

@Component({
  selector: 'app-popular-view',
  templateUrl: './popular-view.component.html',
  styleUrls: ['./popular-view.component.scss']
})
export class PopularViewComponent implements OnInit {

  private _page: Page = {
    size: 0,
    number: 0,
    totalPages: 0,
    totalElements: 0
  };

  private _posts: Post[] = [];
  private _trendingPosts: Post[] = [];
  private _trendingCommunities: Community[] = [];

  private _loading: boolean = false;
  private _postService: PostService;
  private _communityService: CommunityService;
  private _navigationService: NavigationService;

  constructor(postService: PostService, communityService: CommunityService, navigationService: NavigationService) {
    this._postService = postService;
    this._communityService = communityService;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(POPULAR);

    this._communityService.fetchTrending().subscribe(communities => {
      this._trendingCommunities = communities;
    });

    this._postService.fetchTrending().subscribe(posts => {
      this._trendingPosts = posts;
    });

    this.fetchPosts(0);
  }

  private fetchPosts(page: number): void {
    if (!this._loading) {
      this._postService.fetchPage('api/v1/posts/search/findPopular', page, 'include-stats').subscribe(response => {
        const posts = response._embedded.posts;
        this._posts.push(...posts);

        this._page.number = this._page.totalPages;
        this._page.totalPages += Math.min(posts.length, 1);

        this._loading = false;
      }, () => this._loading = false);
    }
  }

  public onScrollEnd($event: UIEvent): void {
    if (this._page.number + 1 <= this._page.totalPages) {
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

}
