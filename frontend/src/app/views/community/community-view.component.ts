import {Component, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {NavigationService} from '../../services/navigation/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit {

  private _community: Community;

  private _httpClient: HttpClient;
  private _activatedRoute: ActivatedRoute;
  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService, activatedRoute: ActivatedRoute, httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._activatedRoute = activatedRoute;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    const communityId = this._activatedRoute.snapshot.params['community'];
    this._httpClient.get('/api/v1/c/' + communityId).subscribe((community: Community) => {
      this._navigationService.navigate(this._community = community);
    });
  }

  get community(): Community {
    return this._community;
  }

}
