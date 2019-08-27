import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';

export interface NavigationItem {
  icon?: string;
  logo?: string;
  route?: string;
  title?: string;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}

export const ALL: NavigationItem = {
  icon: 'equalizer',
  title: 'All',
  route: 'c/all'
};

export const POPULAR: NavigationItem = {
  icon: 'trending_up',
  title: 'Popular',
  route: 'c/popular'
};

export const HOME: NavigationItem = {
  icon: 'home',
  title: 'Home',
  route: 'c/home'
};

export const LOGIN: NavigationItem = {
  icon: 'person',
  title: 'Login',
  route: 'login'
};

export const SIGN_UP: NavigationItem = {
  icon: 'person_add',
  title: 'Sign up',
  route: 'sign-up'
};

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  private active: NavigationItem = POPULAR;

  private items: NavigationGroup[] = [];

  private original: NavigationGroup[] = [
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

  private _router: Router;
  private _activatedRoute: ActivatedRoute;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    this._router = router;
    this._activatedRoute = activatedRoute;
  }

  public ngOnInit(): void {
    this.items = this.original;
    this._router.events.subscribe(value => {
      console.log(value);
    });
  }

  public onSelectionChange(selection: NavigationItem): void {
    this.active = selection;
  }

  public onFilter($event: any): void {
    const input = $event.target.value;
    if (input) {
      this.items = [
        {
          items: [
            {
              title: input,
              icon: 'build'
            }
          ]
        }
      ];
    } else {
      this.items = this.original;
    }
  }
}
