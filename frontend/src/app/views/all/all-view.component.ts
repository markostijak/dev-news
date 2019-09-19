import {Component, OnInit} from '@angular/core';
import {ALL, NavigationService} from '../../services/navigation/navigation.service';
import {Post} from '../../models/post';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Hal, Page} from '../../models/hal';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-all-view',
  templateUrl: './all-view.component.html',
  styleUrls: ['./all-view.component.scss']
})
export class AllViewComponent implements OnInit {

  private _page: Page;
  private _posts: Post[] = [];
  private _httpClient: HttpClient;
  private _navigationService: NavigationService;

  constructor(httpClient: HttpClient, navigationService: NavigationService) {
    this._httpClient = httpClient;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(ALL);
    this.fetchPosts(0).subscribe((response: Hal) => {
      this._posts.push(...response._embedded.posts);
      this._page = response.page;
    });
  }

  public fetchPosts(page: number): Observable<Hal> {
    return this._httpClient.get('/api/v1/posts', {
      params: new HttpParams()
        .set('page', String(page))
        .set('projection', 'inline-community')
        .set('sort', 'createdAt,desc')
    }) as Observable<Hal>;
  }

  get posts(): Post[] {
    return this._posts;
  }
}
