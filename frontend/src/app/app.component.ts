import {Component, OnInit} from '@angular/core';
import {UserState} from './domain/user/user-state';
import {UserService} from './domain/user/user.service';
import {flatMap, takeUntil} from 'rxjs/operators';
import {of} from 'rxjs';
import {SubscriptionSupport} from './domain/utils/subscription-support';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionSupport implements OnInit {

  private userState: UserState;
  private userService: UserService;

  constructor(userState: UserState, userService: UserService) {
    super();
    this.userState = userState;
    this.userService = userService;
  }

  ngOnInit(): void {
    this.userState.user$.pipe(takeUntil(this.destroyed$), flatMap(user => {
      return user ? this.userService.fetchCommunities(user) : of([]);
    })).subscribe(communities => this.userState.communities$.next(communities));
  }

}
