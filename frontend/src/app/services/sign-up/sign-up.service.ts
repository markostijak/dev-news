import {Injectable} from '@angular/core';
import {Authentication, AuthenticationService} from '../authentication/authentication.service';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from '../../models/user';
import {catchError, delay, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private _httpClient: HttpClient;
  private _authenticationService: AuthenticationService;

  constructor(httpClient: HttpClient, authenticationService: AuthenticationService) {
    this._httpClient = httpClient;
    this._authenticationService = authenticationService;
  }

  public checkEmailAvailability(email: string): Observable<boolean> {
    return this._httpClient.get('/api/v1/users/search/existsByEmail', {
      params: new HttpParams().set('email', email)
    }) as Observable<boolean>;
  }

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this._httpClient.get('/api/v1/users/search/existsByUsername', {
      params: new HttpParams().set('username', username)
    }) as Observable<boolean>;
  }

  public signUp(user: object): Observable<User> {
    return this._httpClient.post('/api/sign-up/create', user) as Observable<User>;
  }

  public activate(user: User, activationCode: string): Observable<User> {
    return this._httpClient.post('/api/sign-up/activation/activate', activationCode, {
      params: new HttpParams().set('user', user.id)
    }) as Observable<User>;
  }

  public login(email: string, password: string): Observable<Authentication> {
    return this._authenticationService.login(email, password);
  }

}
