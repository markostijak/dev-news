import {Injectable} from '@angular/core';
import {AuthenticationStore} from './authentication-store';
import {Observable, of} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {Authentication, Credentials} from './authentication';
import {User} from '../user/user';
import {UserAuthenticationListener} from '../user/user-authentication-listener';

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

  public onApplicationStarting(authentication: Authentication): Observable<User> {
    const credentials: Credentials = authentication.credentials || {};

    if (this.authenticationService.isJwtValid(credentials.accessToken)) {
      this.authenticationStore.next(authentication);
      this.authenticationListener.onLogin(authentication);
      return of(authentication.principal);
    }

    if (this.authenticationService.isJwtValid(credentials.refreshToken)) {
      this.authenticationService.jwtRefresh(credentials).subscribe(newAuthentication => {
        this.authenticationStore.next(newAuthentication);
        this.authenticationListener.onLogin(newAuthentication);
      });

      return of(authentication.principal);
    }

    return of({} as User);
  }

  public onLogin(authentication: Authentication): Observable<User> {
    this.authenticationStore.save(authentication);
    this.authenticationListener.onLogin(authentication);
    return of(authentication.principal);
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
