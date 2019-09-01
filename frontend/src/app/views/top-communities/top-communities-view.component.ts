import {Component, OnInit} from '@angular/core';
import {NavigationService, TOP_COMMUNITIES} from '../../services/navigation/navigation.service';
import {Community} from '../../models/community';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-top-communities-view',
  templateUrl: './top-communities-view.component.html',
  styleUrls: ['./top-communities-view.component.scss']
})
export class TopCommunitiesViewComponent implements OnInit {

  private _start: number = 0;
  private _httpClient: HttpClient;
  private _communities: Community[] = [];
  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService, httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(TOP_COMMUNITIES);
    this.fetchCommunities(this._start);
  }

  private fetchCommunities(start: number): void {
    this._httpClient.get('api/v1/c/top-communities', {
      params: new HttpParams()
        .set('start', String(start))
        .set('limit', String(20))
    }).subscribe((communities: Community[]) => {
      this._communities.push(...communities);
      this._start = this._communities.length;
    });
  }

  get communities(): Community[] {
    return this._communities;
  }

  navigate(community: Community): void {
    this._navigationService.navigate(community);
  }

}
