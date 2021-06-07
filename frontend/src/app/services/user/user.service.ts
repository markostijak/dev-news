import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {User} from '../../models/user';
import {defaultIfEmpty, filter, flatMap, map} from 'rxjs/operators';
import {Community} from '../../models/community';
import {RestTemplate} from '../rest/rest-template.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<User>;
  loggedIn$: Observable<boolean>;

  private http: RestTemplate;
  private authenticationService: AuthenticationService;

  constructor(http: RestTemplate, authenticationService: AuthenticationService) {
    this.http = http;
    this.authenticationService = authenticationService;

    this.loggedIn$ = authenticationService.authentication.pipe(
      map(a => !!a.authenticated)
    );

    this.user$ = authenticationService.authentication.pipe(
      filter(a => a.authenticated),
      flatMap(a => this.http.get(a.principal._links.self.href, {
        projection: 'account'
      })),
      defaultIfEmpty(null)
    );
  }

  get authenticated$(): Observable<boolean> {
    return this.loggedIn$;
  }

  public fetchCommunities(): Observable<Community[]> {
    return this.user$.pipe(
      flatMap(u => this.http.get(u._links.communities.href) as Observable<Community[]>)
    );
  }

}
