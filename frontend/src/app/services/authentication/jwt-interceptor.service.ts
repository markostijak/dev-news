import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {Authentication, AuthenticationService, Credentials} from './authentication.service';
import {catchError, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  private _authentication: Authentication;
  private _authenticationService: AuthenticationService;

  private _router: Router;
  private _refreshing = false;
  private _jwtHelper: JwtHelperService;
  private _refreshTokenSubject: BehaviorSubject<Authentication>;

  constructor(router: Router, authenticationService: AuthenticationService) {
    this._router = router;
    this._jwtHelper = new JwtHelperService();
    this._authenticationService = authenticationService;
    this._refreshTokenSubject = new BehaviorSubject<any>(null);
    authenticationService.authentication.subscribe(authentication => {
      this._authentication = authentication;
    });
  }

  private static addToken(request: HttpRequest<any>, jws: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${jws}`
      }
    });
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const credentials = this._authentication.credentials;

    if (credentials) {
      const accessToken = credentials.accessToken;
      const refreshToken = credentials.refreshToken;

      if (true || this._jwtHelper.isTokenExpired(refreshToken, 10)) {
        return this.logout();
      }

      if (this._jwtHelper.isTokenExpired(accessToken, 10)) {
        return this.refreshAccessToken(request, next, credentials);
      }

      request = JwtInterceptorService.addToken(request, accessToken);
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && credentials && credentials.refreshToken) {
        return this.refreshAccessToken(request, next, credentials);
      }

      return throwError(error);
    }));
  }

  private refreshAccessToken(request: HttpRequest<any>, next: HttpHandler, credentials: Credentials): Observable<HttpEvent<any>> {
    if (!this._refreshing) {
      this._refreshing = true;
      this._refreshTokenSubject.next(null);

      return this._authenticationService.jwtRefresh(credentials).pipe(
        switchMap((authentication: Authentication) => {
          this._refreshing = false;
          this._refreshTokenSubject.next(authentication);
          return next.handle(JwtInterceptorService.addToken(request, authentication.credentials.accessToken));
        }));

    } else {
      return this._refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((authentication: Authentication) => {
          return next.handle(JwtInterceptorService.addToken(request, authentication.credentials.accessToken));
        }));
    }
  }

  private logout(): Observable<any> {
    this._authenticationService.logout().subscribe(() => {
      this._router.navigate(['login']);
    });

    return of();
  }

}
