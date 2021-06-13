import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {RestTemplate} from '../utils/rest-template.service';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Hal, Link, Page} from '../utils/hal';
import {Community} from './community';
import {Post} from '../post/post';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private BASE_PATH = environment.baseUrl + 'api/v1/communities';

  private restTemplate: RestTemplate;

  constructor(restTemplate: RestTemplate) {
    this.restTemplate = restTemplate;
  }

  public static mapToArray(hal: Hal<Community[]>): Community[] {
    return hal._embedded.communities;
  }

  public search(search: string): Observable<Community[]> {
    return this.restTemplate.get(this.BASE_PATH + '/search/findByTitleStartsWithIgnoreCase', {
      term: search,
      projection: 'preview'
    }).pipe(map(CommunityService.mapToArray));
  }

  public fetch(communityResource: string | Link, projection?: string): Observable<Community> {
    return this.restTemplate.get(communityResource, {
      projection: projection
    }) as Observable<Community>;
  }

  public fetchPage(params?: object): Observable<[Community[], Page]> {
    return this.restTemplate.get(this.BASE_PATH, params).pipe(
      map((hal: Hal<Community[]>) => [hal._embedded.communities, hal.page])
    ) as Observable<[Community[], Page]>;
  }

  public create(community: Community): Observable<Community> {
    return this.restTemplate.post(this.BASE_PATH, community) as Observable<Community>;
  }

  public update(community: Community, content: string): Observable<Community> {
    return this.restTemplate.patch(community._links.self, {
      description: content
    }) as Observable<any>;
  }

  public fetchByAlias(alias: string): Observable<Community> {
    return this.restTemplate.get(this.BASE_PATH + '/search/findByAlias', {
      alias: alias
    }) as Observable<Community>;
  }

  public fetchPosts(community: Community, params: object): Observable<[Post[], Page]> {
    return this.restTemplate.get(community._links.posts, params).pipe(
      map((hal: Hal<Post[]>) => [hal._embedded.posts, hal.page])
    ) as Observable<[Post[], Page]>;
  }

  public fetchTrending(): Observable<Community[]> {
    return this.restTemplate.get(this.BASE_PATH + '/search/findTrending', {
      projection: 'include-stats'
    }).pipe(map(CommunityService.mapToArray));
  }

  public fetchUpAndComing(params: object): Observable<Community[]> {
    return this.restTemplate.get(this.BASE_PATH + '/search/findUpAndComing', params).pipe(
      map(CommunityService.mapToArray)
    );
  }

}
