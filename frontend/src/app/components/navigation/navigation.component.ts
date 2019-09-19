import {Component, OnInit} from '@angular/core';
import {
  ALL,
  HOME,
  LOGIN,
  NavigationGroup,
  NavigationItem,
  NavigationService,
  POPULAR,
  SIGN_UP,
  TOP_COMMUNITIES
} from '../../services/navigation/navigation.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Community} from '../../models/community';
import {CommunityService} from '../../services/community/community.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  private _items: NavigationGroup[] = [];
  private _original: NavigationGroup[] = [];

  private _httpClient: HttpClient;
  private _communityService: CommunityService;
  private _authenticationService: AuthenticationService;

  private readonly _navigation: Observable<NavigationItem | Community>;

  constructor(httpClient: HttpClient,
              communityService: CommunityService,
              navigationService: NavigationService,
              authenticationService: AuthenticationService) {

    this._httpClient = httpClient;
    this._communityService = communityService;
    this._navigation = navigationService.navigation;
    this._authenticationService = authenticationService;
  }

  public ngOnInit(): void {
    this._authenticationService.authentication.subscribe(authentication => {
      if (authentication.authenticated) {
        const home: NavigationItem = HOME;
        const popular: NavigationItem = POPULAR;
        home.route = '';
        popular.route = 'c/popular';
        this._original = [
          {
            title: 'Feeds',
            items: [
              ALL,
              home,
              POPULAR,
              TOP_COMMUNITIES
            ]
          },
          {
            title: 'My communities',
            items: []
          }
        ];
        this._communityService.myCommunities().subscribe((communities: any) => {
          this._original[1].items = communities;
        });
      } else {
        const home: NavigationItem = HOME;
        const popular: NavigationItem = POPULAR;
        home.route = 'c/home';
        popular.route = '';
        this._original = [
          {
            title: 'Feeds',
            items: [
              ALL,
              popular,
              TOP_COMMUNITIES
            ]
          },
          {
            title: 'Other',
            items: [
              LOGIN,
              SIGN_UP
            ]
          }
        ];
      }

      this.items = this._original;
    });
  }

  public onFilter($event: any): void {
    const input = $event.target.value;
    if (input) {
      const items: NavigationItem[] = [];
      for (const navigationGroup of this._original) {
        for (const navigationItem of navigationGroup.items) {
          if (navigationItem.title.toLowerCase().startsWith(input)) {
            items.push(navigationItem);
          }
        }
      }

      this.items = [{items: items}];
    } else {
      this.items = this._original;
    }
  }

  get items(): NavigationGroup[] {
    return this._items;
  }

  set items(value: NavigationGroup[]) {
    this._items = value;
  }

  get navigation(): Observable<NavigationItem> {
    return this._navigation;
  }
}
