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
import {Community} from '../../models/community';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  private _active: NavigationItem | Community = POPULAR;

  private _items: NavigationGroup[] = [];
  private _original: NavigationGroup[] = [];

  private _httpClient: HttpClient;
  private _navigationService: NavigationService;
  private _authenticationService: AuthenticationService;

  constructor(httpClient: HttpClient, navigationService: NavigationService, authenticationService: AuthenticationService) {
    this._httpClient = httpClient;
    this._navigationService = navigationService;
    this._authenticationService = authenticationService;
  }

  public ngOnInit(): void {
    this._authenticationService.authentication.subscribe(authentication => {
      if (authentication.authenticated) {
        const home: NavigationItem = HOME;
        home.route = '';
        this._original = [
          {
            title: 'Feeds',
            items: [
              ALL,
              POPULAR,
              TOP_COMMUNITIES,
              home
            ]
          },
          {
            title: 'My communities',
            items: []
          }
        ];
      } else {
        const popular: NavigationItem = POPULAR;
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

    // change active item
    this._navigationService.navigation.subscribe(navigationItem => {
      this.active = navigationItem;
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

  get active(): NavigationItem {
    return this._active;
  }

  set active(value: NavigationItem) {
    this._active = value;
  }

  get items(): NavigationGroup[] {
    return this._items;
  }

  set items(value: NavigationGroup[]) {
    this._items = value;
  }

}
