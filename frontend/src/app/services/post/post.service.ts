import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Post} from '../../models/post';
import {CommunityService} from '../community/community.service';
import {Community} from '../../models/community';
import {Comment} from '../../models/comment';
import {CommentService} from '../comment/comment.service';
import {map} from 'rxjs/operators';
import {Hal} from '../../models/hal';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _httpClient: HttpClient;
  private _commentService: CommentService;
  private _communityService: CommunityService;

  constructor(httpClient: HttpClient, commentService: CommentService, communityService: CommunityService) {
    this._httpClient = httpClient;
    this._commentService = commentService;
    this._communityService = communityService;
  }

  public fetchSingle(postResource: string, projection?: string): Observable<Post> {
    let params = new HttpParams();
    if (projection) {
      params = params.set('projection', projection);
    }

    return this.fetchResource(postResource, params) as Observable<Post>;
  }

  public fetchPage(postResource: string, page: number, projection?: string, httpParams?: object): Observable<Hal<Post[]>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('sort', 'createdAt,desc');

    if (projection) {
      params = params.set('projection', projection);
    }

    if (httpParams) {
      for (const k of Object.keys(httpParams)) {
        params = params.set(String(k), String(httpParams[k]));
      }
    }

    return this.fetchResource(postResource, params) as Observable<Hal<Post[]>>;
  }

  public fetchByAlias(alias: string, projection?: string): Observable<Post> {
    let params = new HttpParams();
    if (projection) {
      params = params.set('projection', projection);
    }

    return this.fetchResource('/api/v1/posts/search/findByAlias', params.set('alias', alias)) as Observable<Post>;
  }

  public fetchTrending(): Observable<Post[]> {
    return this.fetchResource('/api/v1/posts/search/findTrending', new HttpParams()
      .set('projection', 'trending'))
      .pipe(map((response: Hal<Post[]>) => response._embedded.posts));
  }

  public fetchTrendingByCommunity(community: Community, size: number): Observable<Post[]> {
    return this.fetchResource('/api/v1/posts/search/findTrendingByCommunityId', new HttpParams()
      .set('communityId', community.id)
      .set('size', String(size))
      .set('projection', 'trending'))
      .pipe(map((response: Hal<Post[]>) => response._embedded.posts));
  }

  public update(post: Post, content: string): Observable<Post> {
    return this._httpClient.patch(post._links.self.href, {
      content: content
    }) as Observable<Post>;
  }

  public create(post: Post): Observable<Post> {
    return this._httpClient.post('api/v1/posts', post) as Observable<Post>;
  }

  public fetchCommunity(post: Post, projection?: string): Observable<Community> {
    return this._communityService.fetch(post._links.self.href + '/community', projection);
  }

  public fetchComments(post: Post, projection?: string): Observable<Comment[]> {
    return this._commentService.fetchAllByPost(post, projection).pipe(map(comments => {
      const buildTree = (items: Comment[], id: string = null) => {
        /* tslint:disable:triple-equals */
        return items.filter(item => item.parentId == id)
          .map(item => ({...item, replies: buildTree(items, item.id)})); };

      return buildTree(comments);
    }));
  }

  public addComment(comment: Comment): Observable<Comment> {
    return this._commentService.create(comment);
  }

  public updateComment(comment: Comment): Observable<Comment> {
    return this._commentService.update(comment);
  }

  public search(term: string): Observable<Post[]> {
    return of([]);
  }

  private fetchResource(resource: string, params: HttpParams): Observable<object> {
    return this._httpClient.get(resource, {
      params: params
    });
  }

}
