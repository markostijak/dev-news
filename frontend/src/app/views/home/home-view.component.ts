import {Component, OnInit} from '@angular/core';
import {HOME, NavigationService} from '../../services/navigation/navigation.service';
import {CommunityService} from '../../services/community/community.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Post} from '../../models/post';
import {Hal, Page} from '../../models/hal';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

  private _page: Page;
  private _posts: Post[] = [];

  private _user: User;

  private _httpClient;
  private _navigationService: NavigationService;
  private _authenticationService: AuthenticationService;

  constructor(httpClient: HttpClient,
              communityService: CommunityService,
              navigationService: NavigationService,
              authenticationService: AuthenticationService) {

    this._httpClient = httpClient;
    this._navigationService = navigationService;
    this._authenticationService = authenticationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(HOME);
    this._authenticationService.authentication.subscribe(authentication => {
      this._user = authentication.principal;
    });
    this.fetchPosts(0);
  }

  private fetchPosts(page: number): void {
    this._httpClient.get('/api/v1/posts/search/findForUser', {
      params: new HttpParams()
        .set('user', this._user.id)
        .set('page', String(page))
        .set('projection', 'inline-community')
        .set('sort', 'createdAt,desc')
    }).subscribe((response: Hal) => {
      this._page = response.page;
      if (response._embedded) {
        this._posts.push(...response._embedded.posts);
      }
    });
  }

  get posts(): Post[] {
    return this._posts;
  }

}
