import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestTemplate} from '../utils/rest-template.service';
import {User} from './user';
import {map} from 'rxjs/operators';
import {CommunityService} from '../community/community.service';
import {Hal, Link, Page} from '../utils/hal';
import {Community} from '../community/community';
import {environment} from '../../../environments/environment';
import {Post} from '../post/post';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_PATH = environment.baseUrl + 'api/v1/users';


  private restTemplate: RestTemplate;

  constructor(restTemplate: RestTemplate) {
    this.restTemplate = restTemplate;
  }

  public fetchByUsername(username: string, projection?: string): Observable<User> {
    return this.restTemplate.get(this.BASE_PATH + '/search/findByUsername', {
      username: username,
      projection: projection
    }) as Observable<User>;
  }

  public fetch(resource: string | Link, projection?: string): Observable<User> {
    return this.restTemplate.get(resource, {projection: projection}) as Observable<User>;
  }

  public fetchCommunities(user: User): Observable<Community[]> {
    return this.restTemplate.get(user._links.communities)
      .pipe(map(CommunityService.mapToArray)) as Observable<Community[]>;
  }

  public joinCommunity(user: User, community: Community): Observable<any> {
    return this.restTemplate.patch(user._links.communities, community._links.self.href, {
      headers: {'Content-Type': 'text/uri-list; charset=utf-8'}
    });
  }

  public updateCommunities(user: User, communities: Community[]): Observable<any> {
    const links = communities.map(c => c._links.self.href);
    return this.restTemplate.put(user._links.communities, links.join('\n'), {
      headers: {'Content-Type': 'text/uri-list; charset=utf-8'}
    });
  }

  public existsByEmail(email: string): Observable<boolean> {
    return this.restTemplate.get(this.BASE_PATH + '/search/existsByEmail', {
      email: email
    }) as Observable<boolean>;
  }

  public existsByUsername(username: string): Observable<boolean> {
    return this.restTemplate.get(this.BASE_PATH + '/search/existsByUsername', {
      username: username
    }) as Observable<boolean>;
  }

  public create(user: User): Observable<User> {
    return this.restTemplate.post(this.BASE_PATH, user) as Observable<User>;
  }

  public activate(user: User, activationCode: string): Observable<User> {
    return this.restTemplate.post(user._links.activate.href, JSON.stringify(activationCode), {
      headers: {'Content-Type': 'application/json'}
    }) as Observable<User>;
  }

  public fetchPosts(user: User, params?: object): Observable<[Post[], Page]> {
    return this.restTemplate.get(user._links.posts, params).pipe(
      map((hal: Hal<Post[]>) => [hal._embedded.posts, hal.page])
    ) as Observable<[Post[], Page]>;
  }

  public update(user: User): Observable<User> {
    return this.restTemplate.patch(user._links.self, {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      picture: user.picture,
    }) as Observable<User>;
  }

  public revokeDevice(user: User, device: string): Observable<any> {
    return this.restTemplate.delete(user._links.self.href + '/devices/' + device);
  }

}
