import {Injectable} from '@angular/core';
import {AuthenticationAware} from './authentication-aware';
import {Authentication, Credentials} from './authentication';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthenticationProcessor} from './authentication-porcessor';
import {JwtProvider} from './jwt-provider';
import {AuthenticationStore} from './authentication-store';
import {Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class JwtAwareHttpInterceptor extends AuthenticationAware implements HttpInterceptor {

  private refreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  private router: Router;
  private jwtProvider: JwtProvider;
  private authenticationService: AuthenticationService;
  private authenticationProcessor: AuthenticationProcessor;

  constructor(router: Router,
              jwtProvider: JwtProvider,
              authenticationStore: AuthenticationStore,
              authenticationService: AuthenticationService,
              authenticationProcessor: AuthenticationProcessor) {
    super(authenticationStore);
    this.router = router;
    this.jwtProvider = jwtProvider;
    this.authenticationService = authenticationService;
    this.authenticationProcessor = authenticationProcessor;
  }

  private static addToken(request: HttpRequest<any>, jws: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${jws}`
      }
    });
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (request.url.indexOf('assets') !== -1) {
      return next.handle(request);
    }

    const credentials = this.authentication.credentials;

    if (credentials) {
      const accessToken = credentials.accessToken;
      const refreshToken = credentials.refreshToken;

      if (this.jwtProvider.isTokenExpired(refreshToken, 60)) {
        return this.logout();
      }

      if (this.jwtProvider.isTokenExpired(accessToken, 60)) {
        return this.refreshAccessToken(request, next, credentials);
      }

      request = JwtAwareHttpInterceptor.addToken(request, accessToken);
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && credentials && credentials.refreshToken) {
        return this.refreshAccessToken(request, next, credentials);
      }

      return throwError(error);
    }));
  }

  private refreshAccessToken(request: HttpRequest<any>, next: HttpHandler, credentials: Credentials): Observable<HttpEvent<any>> {
    if (!this.refreshing) {
      this.refreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authenticationService.jwtRefresh(credentials).pipe(
        switchMap((authentication: Authentication) => {
          this.refreshing = false;
          this.refreshTokenSubject.next(authentication);
          this.authenticationProcessor.onJwtRefresh(authentication);
          return next.handle(JwtAwareHttpInterceptor.addToken(request, authentication.credentials.accessToken));
        }), catchError(() => this.logout()));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((authentication: Authentication) => {
          return next.handle(JwtAwareHttpInterceptor.addToken(request, authentication.credentials.accessToken));
        }));
    }
  }

  private logout(): Observable<any> {
    this.authenticationProcessor.onLogout(this.authentication).subscribe(() => {
      this.router.navigate(['login']);
    });

    return of({});
  }

}
