import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../models/user';
import {AuthenticationService} from '../authentication/authentication.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Community} from '../../models/community';
import {map, switchMap} from 'rxjs/operators';
import {Hal} from '../../models/hal';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private _user: User;
  private _httpClient: HttpClient;
  private _communities: Community[] = [];
  private _communitiesObservable: Observable<Community[]>;
  private _communitiesSubject: BehaviorSubject<Community[]>;

  constructor(httpClient: HttpClient, authenticationService: AuthenticationService) {
    this._httpClient = httpClient;
    authenticationService.authentication.subscribe(authentication => {
      this._user = authentication.principal;
    });
  }

  public join(community: Community): Observable<any> {
    return this._httpClient.patch('/api/v1/users/' + this._user.id + '/communities', '/api/v1/users/communities/' + community.id, {
      headers: new HttpHeaders({'Content-Type': 'text/uri-list; charset=utf-8'})
    }).pipe(map(() => this._communities.push(community)));
  }

  public leave(community: Community): Observable<any> {
    return this._httpClient.delete('/api/v1/users/' + this._user.id + '/communities/' + community.id)
      .pipe(map(() => {
        for (let i = 0; i < this._communities.length; i++) {
          if (this._communities[i].id === community.id) {
            this._communities.splice(i, 1);
          }
        }
      }));
  }

  public memberOf(community: Community): boolean {
    return this._communities.find(c => c.id === community.id) != null;
  }

  public myCommunities(): Observable<Community[]> {
    if (!this._communitiesSubject) {
      return this._httpClient.get('/api/v1/users/' + this._user.id + '/communities').pipe(switchMap((hal: Hal) => {
        this._communities = hal._embedded.communities;
        this._communitiesSubject = new BehaviorSubject<Community[]>(this._communities);
        return this._communitiesObservable = this._communitiesSubject.asObservable();
      }));
    }

    return this._communitiesObservable;
  }

}
