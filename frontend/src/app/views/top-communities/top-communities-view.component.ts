import {Component, OnInit} from '@angular/core';
import {NavigationService, TOP_COMMUNITIES} from '../../services/navigation/navigation.service';
import {Community} from '../../models/community';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Hal, Page} from '../../models/hal';
import {Post} from '../../models/post';

@Component({
  selector: 'app-top-communities-view',
  templateUrl: './top-communities-view.component.html',
  styleUrls: ['./top-communities-view.component.scss']
})
export class TopCommunitiesViewComponent implements OnInit {

  private _page: Page;
  private _communities: Community[] = [];

  private _httpClient: HttpClient;
  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService, httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(TOP_COMMUNITIES);
    this.fetchCommunities(0);
  }

  private fetchCommunities(start: number): void {
    this._httpClient.get('api/v1/communities', {
      params: new HttpParams()
        .set('page', String(start))
        .set('sort', 'members,desc')
        .set('projection', 'include-stats')
    }).subscribe((hal: Hal<Community[]>) => {
      this._communities.push(...hal._embedded.communities);
      this._page = hal.page;
    });
  }

  get communities(): Community[] {
    return this._communities;
  }

  navigate(community: Community): void {
    this._navigationService.navigate(community);
  }

}
