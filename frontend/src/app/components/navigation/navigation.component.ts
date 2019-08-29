import {Component, OnInit} from '@angular/core';
import {
  ALL,
  HOME,
  LOGIN,
  NavigationGroup,
  NavigationItem,
  NavigationService,
  POPULAR,
  SIGN_UP
} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  private _active: NavigationItem = POPULAR;

  private _items: NavigationGroup[] = [];

  private _original: NavigationGroup[] = [
    {
      title: 'Feeds',
      items: [
        ALL,
        POPULAR,
        HOME
      ]
    },
    {
      title: 'My communities',
      items: [
        {
          logo: 'https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/java-512.png',
          title: 'Java',
          route: 'c/Java'
        }
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

  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
  }

  public ngOnInit(): void {
    this._items = this._original;
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
