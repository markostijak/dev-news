import {Component, OnInit} from '@angular/core';
import {HOME, NavigationService} from '../../services/navigation/navigation.service';
import {CommunityService} from '../../services/community/community.service';
import {Post} from '../../models/post';
import {Page} from '../../models/hal';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {User} from '../../models/user';
import {Community} from '../../models/community';
import {PostService} from '../../services/post/post.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

  private _user: User;
  private _page: Page;
  private _posts: Post[];
  private _trendingPosts: Post[] = [];
  private _trendingCommunities: Community[] = [];
  private _upAndComingCommunities: Community[] = [];

  private _postService: PostService;
  private _communityService: CommunityService;
  private _navigationService: NavigationService;
  private _authenticationService: AuthenticationService;

  constructor(postService: PostService,
              communityService: CommunityService,
              navigationService: NavigationService,
              authenticationService: AuthenticationService) {

    this._postService = postService;
    this._communityService = communityService;
    this._navigationService = navigationService;
    this._authenticationService = authenticationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(HOME);

    this._authenticationService.authentication.subscribe(authentication => {
      this._user = authentication.principal;
    });

    this._communityService.fetchTrending().subscribe(communities => {
      this._trendingCommunities = communities;
    });

    this._postService.fetchTrending().subscribe(posts => {
      this._trendingPosts = posts;
    });

    this._communityService.fetchUpAndComing().subscribe(communities => {
      this._upAndComingCommunities = communities;
    });

    this.fetchPosts(0);
  }

  private fetchPosts(page: number): void {
    this._postService.fetchPage('api/v1/posts/search/findForUser', page, 'include-stats', {
      user: this._user.id
    }).subscribe(response => {
      if (response._embedded) {
        if (this._posts) {
          this._posts.push(...response._embedded.posts);
        } else {
          this._posts = response._embedded.posts;
        }
      } else {
        this._posts = [];
      }
      this._page = response.page;
    });
  }

  public onScrollEnd($event: UIEvent): void {
    if (this._page && (this._page.number + 1 < this._page.totalPages)) {
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
