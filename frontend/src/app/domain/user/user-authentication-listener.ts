import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {Authentication} from '../authentication/authentication';
import {Observable, of} from 'rxjs';
import {User} from './user';
import {State} from '../state';
import {skip} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationListener {

  private state: State;
  private userService: UserService;

  constructor(state: State, userService: UserService) {
    this.state = state;
    this.userService = userService;
  }

  public onLogin(authentication: Authentication): Observable<User> {
    this.userService.fetch(authentication.principal._links.self.href, 'account')
      .subscribe(user => {
        this.userService.fetchCommunities(user).subscribe(communities => {
          this.state.communities$.next(communities);
          this.state.user$.next(user);
        });
      });

    return this.state.user$.pipe(skip(1));
  }

  public onLogout(authentication?: Authentication): Observable<User> {
    this.state.user$.next(null);
    this.state.communities$.next(null);
    return of(null);
  }

}
