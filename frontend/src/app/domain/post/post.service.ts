import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RestTemplate} from '../utils/rest-template.service';
import {environment} from '../../../environments/environment';
import {Hal, Link, Page} from '../utils/hal';
import {Post} from './post';
import {Community} from '../community/community';
import {Comment} from '../comment/comment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private BASE_PATH = environment.baseUrl + 'api/v1/posts';

  private restTemplate: RestTemplate;

  constructor(restTemplate: RestTemplate) {
    this.restTemplate = restTemplate;
  }

  public static mapToArray(hal: Hal<Post[]>): Post[] {
    return hal._embedded.posts;
  }

  public create(community: Community, post: Post): Observable<Post> {
    return this.restTemplate.post(this.BASE_PATH, {
      ...post, community: community._links.self.href
    }) as Observable<Post>;
  }

  public update(post: Post, content: string): Observable<Post> {
    return this.restTemplate.patch(post._links.self.href, {
      content: content
    }) as Observable<Post>;
  }

  public delete(post: Post): Observable<null> {
    return this.restTemplate.delete(post._links.self.href) as Observable<null>;
  }

  public fetch(postResource: string | Link, projection?: string): Observable<Post> {
    return this.restTemplate.get(postResource, {
      projection: projection
    }) as Observable<Post>;
  }

  public fetchPageResource(pageResource: string | Link, params?: object): Observable<[Post[], Page]> {
    return this.restTemplate.get(pageResource, params).pipe(
      map((hal: Hal<Post[]>) => [hal._embedded.posts, hal.page])
    ) as Observable<[Post[], Page]>;
  }

  public fetchPage(params?: object): Observable<[Post[], Page]> {
    return this.restTemplate.get(this.BASE_PATH, params).pipe(
      map((hal: Hal<Post[]>) => [hal._embedded.posts, hal.page])
    ) as Observable<[Post[], Page]>;
  }

  public fetchByAlias(alias: string, projection?: string): Observable<Post> {
    return this.restTemplate.get(this.BASE_PATH + '/search/findByAlias', {
      alias: alias,
      projection: projection
    }) as Observable<Post>;
  }

  public fetchPopular(params?: object): Observable<[Post[], Page]> {
    return this.fetchPageResource(this.BASE_PATH + '/search/findPopular', params);
  }

  public fetchTrending(params?: object): Observable<[Post[], Page]> {
    return this.fetchPageResource(this.BASE_PATH + '/search/findTrending', params);
  }

  public fetchComments(post: Post, params?: object): Observable<[Comment[], Page]> {
    return this.restTemplate.get(post._links.comments, params).pipe(
      map((hal: Hal<Comment[]>) => [hal._embedded.comments, hal.page])
    ) as Observable<[Comment[], Page]>;
  }

  public search(search: string): Observable<Post[]> {
    return this.restTemplate.get(this.BASE_PATH + '/search/findByTitleStartsWithIgnoreCase', {
      size: 10,
      term: search,
      projection: 'view'
    }).pipe(map(PostService.mapToArray));
  }

}
