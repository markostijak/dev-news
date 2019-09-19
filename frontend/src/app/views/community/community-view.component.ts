import {Component, OnDestroy, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {NavigationService} from '../../services/navigation/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {Post} from '../../models/post';
import {Hal, Page} from '../../models/hal';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit, OnDestroy {

  private _page: Page;
  private _posts: Post[] = [];
  private _community: Community;

  private _httpClient: HttpClient;
  private _activatedRoute: ActivatedRoute;
  private _navigationService: NavigationService;

  private _subscription: Subscription = new Subscription();

  constructor(navigationService: NavigationService, activatedRoute: ActivatedRoute, httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._activatedRoute = activatedRoute;
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
    this._httpClient.get('/api/v1/communities/search/findByAlias', {
      params: new HttpParams()
        .set('alias', alias)
        .set('projection', 'include-stats')
    }).subscribe((community: Community) => {
      this._navigationService.navigate(community);
      this.fetchPosts(community, 0).subscribe(hal => {
        this._posts.push(...hal._embedded.posts);
        this._community = community;
        this._page = hal.page;
      });
    });
  }

  private fetchPosts(community: Community, page: number): Observable<Hal> {
    return this._httpClient.get('/api/v1/posts/search/findAllByCommunityId', {
      params: new HttpParams()
        .set('id', community.id)
        .set('page', String(page))
        .set('sort', 'createdAt,desc')
        .set('projection', 'inline-community')
    }) as Observable<Hal>;
  }

  get community(): Community {
    return this._community;
  }

  get posts(): Post[] {
    return this._posts;
  }

}
