import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {Post} from '../../models/post';
import {CommunityService} from '../community/community.service';
import {Community} from '../../models/community';
import {Comment} from '../../models/comment';
import {CommentService} from '../comment/comment.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _user: User;
  private _httpClient: HttpClient;
  private _commentService: CommentService;
  private _communityService: CommunityService;

  private _newPost: BehaviorSubject<Post>;

  constructor(httpClient: HttpClient,
              commentService: CommentService,
              communityService: CommunityService,
              authenticationService: AuthenticationService) {

    this._httpClient = httpClient;
    this._commentService = commentService;
    this._communityService = communityService;
    this._newPost = new BehaviorSubject<Post>(null);

    authenticationService.authentication.subscribe(authentication => {
      this._user = authentication.principal;
    });
  }

  public fetch(postResource: string, projection?: string): Observable<Post> {
    let params = new HttpParams();
    if (projection) {
      params = params.set('projection', projection);
    }

    return this.fetchResource(postResource, params) as Observable<Post>;
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
      const buildTree = (items: Comment[], id: string = null) =>
        items.filter(item => item.parentId === id)
          .map(item => ({...item, replies: buildTree(items, item.id)}));

      return buildTree(comments);
    }));
  }

  public addComment(comment: Comment): Observable<Comment> {
    return this._commentService.create(comment);
  }

  public updateComment(comment: Comment): Observable<Comment> {
    return this._commentService.update(comment);
  }

  private fetchResource(resource: string, params: HttpParams): Observable<object> {
    return this._httpClient.get(resource, {
      params: params
    });
  }

}
