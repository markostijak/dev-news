import {Component, OnDestroy, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {NavigationService} from '../../services/navigation/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit, OnDestroy {

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
      this.reload(params['community']);
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private reload(id: string): void {
    this._httpClient.get('/api/v1/c/' + id).subscribe((community: Community) => {
      this._navigationService.navigate(this._community = community);
    });
  }

  get community(): Community {
    return this._community;
  }

}
