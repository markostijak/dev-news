import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Authentication, AuthenticationService, Credentials} from './authentication.service';
import {catchError, filter, switchMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  private _refreshing = false;
  private _authentication: Authentication;
  private _refreshTokenSubject: BehaviorSubject<Authentication>;
  private _authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {
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
    if (credentials && credentials.accessToken) {
      request = JwtInterceptorService.addToken(request, credentials.accessToken);
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && credentials && credentials.refreshToken) {
        return this.handle401Error(request, next, credentials);
      }

      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, credentials: Credentials): Observable<HttpEvent<any>> {
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

}
