import {Component, OnInit} from '@angular/core';
import {NavigationService, POPULAR} from '../../services/navigation/navigation.service';
import {Hal, Page} from '../../models/hal';
import {Post} from '../../models/post';
import {CommunityService} from '../../services/community/community.service';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-popular-view',
  templateUrl: './popular-view.component.html',
  styleUrls: ['./popular-view.component.scss']
})
export class PopularViewComponent implements OnInit {

  private _page: Page;
  private _posts: Post[] = [];

  private _httpClient;
  private _navigationService: NavigationService;

  constructor(httpClient: HttpClient,
              communityService: CommunityService,
              navigationService: NavigationService) {

    this._httpClient = httpClient;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(POPULAR);
    this.fetchPosts(0);
  }

  private fetchPosts(page: number): void {
    this._httpClient.get('/api/v1/posts/search/findPopular', {
      params: new HttpParams()
        .set('page', String(page))
        .set('sort', 'createdAt,desc')
        .set('projection', 'inline-community')
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
