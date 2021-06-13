import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestTemplate} from '../utils/rest-template.service';
import {Comment} from './comment';
import {Post} from '../post/post';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Hal, Link, Page} from '../utils/hal';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private BASE_PATH = environment.baseUrl + 'api/v1/comments';

  private restTemplate: RestTemplate;

  constructor(restTemplate: RestTemplate) {
    this.restTemplate = restTemplate;
  }

  public fetchPage(resource: string | Link, params?: any): Observable<[Comment[], Page]> {
    return this.restTemplate.get(resource, params).pipe(
      map((hal: Hal<Comment[]>) => [hal._embedded ? hal._embedded.comments : [], hal.page])
    ) as Observable<[Comment[], Page]>;
  }

  public create(post: Post, comment: Comment): Observable<Comment> {
    return this.restTemplate.post(this.BASE_PATH, {
      ...comment,
      post: post._links.self.href,
      // parent: null
    }) as Observable<Comment>;
  }

  public addReply(post: Post, comment: Comment, reply: Comment): Observable<Comment> {
    return this.restTemplate.post(this.BASE_PATH, {
      ...reply,
      post: post._links.self.href,
      parent: comment._links.self.href
    }) as Observable<Comment>;
  }

  public update(comment: Comment, content: string): Observable<Comment> {
    return this.restTemplate.patch(comment._links.self.href, {
      content: content
    }) as Observable<Comment>;
  }

  public delete(comment: Comment): Observable<null> {
    return this.restTemplate.delete(comment._links.self.href) as Observable<null>;
  }

}
