import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {User} from "../../models/user";
import {fromPromise} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  private _refreshing = false;
  private _authenticationService: AuthenticationService;
  private _refreshTokenSubject: BehaviorSubject<any>;

  constructor(authenticationService: AuthenticationService) {
    this._authenticationService = authenticationService;
    this._refreshTokenSubject = new BehaviorSubject<any>(null)
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let user: User = this._authenticationService.user;

    if (user) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return this.handle401Error(request, next, user.accessToken, user.refreshToken);
      }

      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, accessToken: string, refreshToken: string): Observable<HttpEvent<any>> {
    if (!this._refreshing) {
      this._refreshing = true;
      this._refreshTokenSubject.next(null);

      return fromPromise(this._authenticationService.jwtRefresh(accessToken, refreshToken)).pipe(
        switchMap((token: any) => {
          this._refreshing = false;
          this._refreshTokenSubject.next(token.jws);
          return next.handle(JwtInterceptorService.addToken(request, token.jws));
        }));

    } else {
      return this._refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(JwtInterceptorService.addToken(request, jwt));
        }));
    }
  }

  private static addToken(request: HttpRequest<any>, jws: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${jws}`
      }
    });
  }

}
