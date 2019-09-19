import {Component, OnDestroy, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {Post} from '../../models/post';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../services/navigation/navigation.service';
import {Observable, Subscription} from 'rxjs';
import {TimeAgoService} from '../../services/time-ago/time-ago.service';
import {Authentication, AuthenticationService} from '../../services/authentication/authentication.service';
import {Data} from '../../components/comment/comment-editor/comment-editor.component';
import {Comment} from '../../models/comment';
import {User} from '../../models/user';
import {map} from 'rxjs/operators';
import {Hal} from '../../models/hal';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit, OnDestroy {

  private _post: Post;
  private _community: Community;
  private _comments: Comment[] = [];

  private _httpClient: HttpClient;
  private _authentication: Observable<Authentication>;
  private _activatedRoute: ActivatedRoute;
  private _navigationService: NavigationService;
  private readonly _timeFormatter: TimeAgoService;

  private _startEditing: boolean = false;
  private _subscription: Subscription = new Subscription();

  private _user: User;

  constructor(httpClient: HttpClient,
              timeFormatter: TimeAgoService,
              activatedRoute: ActivatedRoute,
              navigationService: NavigationService,
              authenticationService: AuthenticationService) {

    this._httpClient = httpClient;
    this._timeFormatter = timeFormatter;
    this._activatedRoute = activatedRoute;
    this._navigationService = navigationService;
    this._authentication = authenticationService.authentication;
    this.authentication.subscribe((a: Authentication) => {
      this._user = a.principal;
    });
  }

  ngOnInit(): void {
    this._subscription.add(this._activatedRoute.params.subscribe(params => {
      this._community = null;
      this.reload(params['post']);
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private reload(id: string): void {
    this._httpClient.get('/api/v1/posts/' + id, {
      params: new HttpParams()
        .set('projection', 'inline-community')
    }).subscribe((post: Post) => {
      this._navigationService.navigate(post.community);
      this.fetchCommunity(post.community.id).subscribe(community => {
        this._post = post;
        this._community = community;
      });
      this.fetchComments(post.id).subscribe(comments => this._comments.push(...comments));
    });
  }

  private fetchCommunity(communityId: string): Observable<Community> {
    return this._httpClient.get('/api/v1/communities/' + communityId, {
      params: new HttpParams()
        .set('projection', 'include-stats')
    }) as Observable<Community>;
  }

  private fetchComments(postId: string): Observable<Comment[]> {
    return this._httpClient.get('/api/v1/comments/search/findAllByPost', {
      params: new HttpParams()
        .set('post', '/api/v1/posts/' + postId)
        .set('projection', 'inline-replies')
        .set('sort', 'createdAt,asc')
    }).pipe(map((hal: Hal) => hal._embedded.comments)) as Observable<Comment[]>;
  }

  onSave($event: Data): void {
    this._httpClient.post('/api/v1/comments', {
      content: $event.content,
      post: '/api/v1/posts/' + this._post.id
    }).subscribe((comment: Comment) => {
      comment.createdBy = this._user;
      this._comments.push(comment);
      $event.editor.reset();
    });
  }

  showEditor(): void {
    this._startEditing = true;
  }

  onPostEditSave($event: string): void {
    this.post.content = $event;
    this._startEditing = false;
  }

  onPostEditCancel(): void {
    this._startEditing = false;
  }

  get post(): Post {
    return this._post;
  }

  get community(): Community {
    return this._community;
  }

  get timeFormatter(): TimeAgoService {
    return this._timeFormatter;
  }

  get authentication(): Observable<Authentication> {
    return this._authentication;
  }

  get comments(): Comment[] {
    return this._comments;
  }

  get startEditing(): boolean {
    return this._startEditing;
  }
}
