import {Injectable} from '@angular/core';
import {Authentication, AuthenticationService} from '../authentication/authentication.service';
import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private httpClient: HttpClient;
  private authenticationService: AuthenticationService;

  constructor(httpClient: HttpClient, authenticationService: AuthenticationService) {
    this.httpClient = httpClient;
    this.authenticationService = authenticationService;
  }

  public checkEmailAvailability(email: string): Observable<boolean> {
    return this.httpClient.get('api/v1/users/search/existsByEmail', {
      params: new HttpParams().set('email', email)
    }) as Observable<boolean>;
  }

  public checkUsernameAvailability(username: string): Observable<boolean> {
    return this.httpClient.get('api/v1/users/search/existsByUsername', {
      params: new HttpParams().set('username', username)
    }) as Observable<boolean>;
  }

  public signUp(user: object): Observable<User> {
    return this.httpClient.post('api/v1/users', user) as Observable<User>;
  }

  public activate(user: User, activationCode: string): Observable<User> {
    return this.httpClient.post(user._links.activate.href, JSON.stringify(activationCode), {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }) as Observable<User>;
  }

  public login(email: string, password: string): Observable<Authentication> {
    return this.authenticationService.login(email, password);
  }

}
