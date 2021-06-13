import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Authentication, Credentials} from './authentication';
import {SocialUser} from 'angularx-social-login';
import {catchError, map} from 'rxjs/operators';
import {HttpBackend, HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {JwtProvider} from './jwt-provider';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private httpClient: HttpClient;
  private jwtProvider: JwtProvider;

  constructor(httpBackend: HttpBackend, jwtProvider: JwtProvider) {
    this.jwtProvider = jwtProvider;
    this.httpClient = new HttpClient(httpBackend);
  }

  public login(email: string, password: string): Observable<Authentication> {
    return this.authenticate('login', email, password);
  }

  public oauthLogin(socialUser: SocialUser): Observable<Authentication> {
    return this.authenticate('login/oauth', socialUser.provider, socialUser.authorizationCode);
  }

  public jwtRefresh(credentials: Credentials): Observable<Authentication> {
    return this.authenticate('refresh', credentials.accessToken, credentials.refreshToken);
  }

  private authenticate(url: string, principal: string, credentials: string): Observable<Authentication> {
    return this.httpClient.post(environment.baseUrl + url, {}, {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(principal + ':' + credentials)
      }), observe: 'response'
    }).pipe(
      map((response: HttpResponse<any>) => {
        const accessToken = response.headers.get('X-Auth-Token');
        const refreshToken = response.headers.get('X-Refresh-Token');

        const authenticated = this.jwtProvider.isValid(accessToken) && this.jwtProvider.isValid(refreshToken);

        const deserialized = {
          principal: response.body,
          credentials: {
            accessToken: accessToken,
            refreshToken: refreshToken
          },
          authenticated: authenticated
        };

        return new Authentication(deserialized);
      }),
      catchError(() => of(new Authentication({})))
    );
  }

  public isJwtValid(token: string): boolean {
    return token && !this.jwtProvider.isTokenExpired(token);
  }

}
