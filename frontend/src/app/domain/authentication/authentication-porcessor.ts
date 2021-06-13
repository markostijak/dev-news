import {Injectable} from '@angular/core';
import {AuthenticationStore} from './authentication-store';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {Authentication, Credentials} from './authentication';
import {User} from '../user/user';
import {UserAuthenticationListener} from '../user/user-authentication-listener';
import {skip} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationProcessor {

  private authenticationStore: AuthenticationStore;
  private authenticationService: AuthenticationService;
  private authenticationListener: UserAuthenticationListener;

  constructor(authenticationStore: AuthenticationStore,
              authenticationService: AuthenticationService,
              authenticationListener: UserAuthenticationListener) {
    this.authenticationStore = authenticationStore;
    this.authenticationService = authenticationService;
    this.authenticationListener = authenticationListener;
  }

  public onApplicationStarting(): Observable<any> {
    const authentication = this.authenticationStore.get();
    const credentials: Credentials = authentication.credentials || {};

    const result = new BehaviorSubject<any>(null);
    const waitForIt = result.pipe(skip(1));

    if (this.authenticationService.isJwtValid(credentials.accessToken)) {
      this.authenticationStore.next(authentication);
      this.authenticationListener.onLogin(authentication).subscribe(user => result.next(user));
      return waitForIt;
    }

    if (this.authenticationService.isJwtValid(credentials.refreshToken)) {
      this.authenticationService.jwtRefresh(credentials).subscribe(newAuthentication => {
        this.authenticationStore.next(newAuthentication);
        this.authenticationListener.onLogin(newAuthentication).subscribe(user => result.next(user));
      });

      return waitForIt;
    }

    return of({});
  }

  public onLogin(authentication: Authentication): Observable<User> {
    this.authenticationStore.save(authentication);
    return this.authenticationListener.onLogin(authentication);
  }

  public onJwtRefresh(authentication: Authentication): Observable<User> {
    this.authenticationStore.save(authentication);
    return of(authentication.principal);
  }

  public onLogout(authentication?: Authentication): Observable<any> {
    this.authenticationStore.clear();
    this.authenticationListener.onLogout(authentication);
    return of({});
  }

}
