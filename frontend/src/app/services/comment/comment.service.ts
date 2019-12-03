import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {Comment} from '../../models/comment';
import {Post} from '../../models/post';
import {map} from 'rxjs/operators';
import {Hal} from '../../models/hal';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private _user: User;
  private _httpClient: HttpClient;

  constructor(httpClient: HttpClient, authenticationService: AuthenticationService) {
    this._httpClient = httpClient;
    authenticationService.authentication.subscribe(authentication => {
      this._user = authentication.principal;
    });
  }

  public create(comment: Comment): Observable<Comment> {
    return this._httpClient.post('api/v1/comments', comment) as Observable<Comment>;
  }

  public update(comment: Comment): Observable<Comment> {
    return this._httpClient.patch(comment._links.self.href, {
      content: comment.content
    }) as Observable<Comment>;
  }

  public fetchAllByPost(post: Post, projection?: string): Observable<Comment[]> {
    let params = new HttpParams();
    if (projection) {
      params = params.set('projection', projection);
    }

    return this.fetchResource('api/v1/comments/search/findAllByPost', params
      .set('post', post._links.self.href)
      .set('sort', 'fullSlug,asc')
    ).pipe(map((hal: Hal<Comment[]>) => hal._embedded.comments)) as Observable<Comment[]>;
  }

  private fetchResource(resource: string, params: HttpParams): Observable<object> {
    return this._httpClient.get(resource, {
      params: params
    });
  }

  public delete(comment: Comment) {
    return this._httpClient.delete(comment._links.self.href);
  }

}
