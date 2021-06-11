import {Component, OnInit} from '@angular/core';

import {SubscriptionSupport} from '../../domain/utils/subscription-support';
import {combineLatest} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {State} from '../../domain/state';
import {ALL, HOME, LOGIN, NavigationGroup, NavigationItem, POPULAR, SIGN_UP, TOP_COMMUNITIES} from '../../domain/utils/navigation';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent extends SubscriptionSupport implements OnInit {

  items: NavigationGroup[] = [];
  original: NavigationGroup[] = [];

  state: State;

  constructor(state: State) {
    super();
    this.state = state;
  }

  public ngOnInit(): void {
    combineLatest(this.state.user$, this.state.communities$).pipe(takeUntil(this.destroyed$))
      .subscribe(([user, communities]) => {
        if (user) {
          const home: NavigationItem = HOME;
          const popular: NavigationItem = POPULAR;
          home.route = '';
          popular.route = 'c/popular';
          this.original = [
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
              items: communities
            }
          ];
        } else {
          const home: NavigationItem = HOME;
          const popular: NavigationItem = POPULAR;
          home.route = 'c/home';
          popular.route = '';
          this.original = [
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

        this.items = this.original;
      });
  }

  public onFilter($event: any): void {
    const input = $event.target.value;
    if (input) {
      const items: NavigationItem[] = [];
      for (const navigationGroup of this.original) {
        for (const navigationItem of navigationGroup.items) {
          if (navigationItem.title.toLowerCase().startsWith(input)) {
            items.push(navigationItem);
          }
        }
      }

      this.items = [{items: items}];
      return;
    }

    this.items = this.original;
  }

}
