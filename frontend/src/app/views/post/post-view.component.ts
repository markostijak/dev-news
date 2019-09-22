import {Component, OnDestroy, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {Post} from '../../models/post';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../services/navigation/navigation.service';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {TimeAgoService} from '../../services/time-ago/time-ago.service';
import {Authentication, AuthenticationService} from '../../services/authentication/authentication.service';
import {Data} from '../../components/comment/comment-editor/comment-editor.component';
import {Comment} from '../../models/comment';
import {User} from '../../models/user';
import {PostService} from '../../services/post/post.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit, OnDestroy {

  private _post: Post;
  private _community: Community;
  private _comments: Comment[] = [];

  private _postService: PostService;
  private _activatedRoute: ActivatedRoute;
  private _navigationService: NavigationService;
  private readonly _timeFormatter: TimeAgoService;
  private _authentication: Observable<Authentication>;

  private _startEditing: boolean = false;
  private _subscription: Subscription = new Subscription();

  private _user: User;

  constructor(postService: PostService,
              timeFormatter: TimeAgoService,
              activatedRoute: ActivatedRoute,
              navigationService: NavigationService,
              authenticationService: AuthenticationService) {

    this._postService = postService;
    this._timeFormatter = timeFormatter;
    this._activatedRoute = activatedRoute;
    this._navigationService = navigationService;
    this._authentication = authenticationService.authentication;
  }

  ngOnInit(): void {
    this.authentication.subscribe((a: Authentication) => {
      this._user = a.principal;
    });

    this._subscription.add(this._activatedRoute.params.subscribe(params => {
      this._community = null;
      this.reload(params['post']);
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private reload(id: string): void {
    this._postService.fetch('/api/v1/posts/' + id, 'include-stats').subscribe(post => {
      this._navigationService.navigate(post.community);

      forkJoin({
        community: this._postService.fetchCommunity(post, 'include-stats'),
        comments: this._postService.fetchComments(post, 'preview')
      }).subscribe(result => {
        this._post = post;
        this._community = result.community;
        this._comments.push(...result.comments);
      });
    });
  }

  onSave($event: Data): void {
    this._postService.addComment({content: $event.content, post: this._post._links.self.href} as Comment).subscribe(comment => {
      comment.createdBy = this._user;
      this._comments.push(comment);
      this.post.commentsCount++;
      $event.editor.reset();
    });
  }

  onPostEditSave(content: string): void {
    this._postService.update(this._post, content).subscribe(post => {
      this._post.content = post.content;
      this._post.updatedAt = post.updatedAt;
      this._startEditing = false;
    });
  }

  showEditor(): void {
    this._startEditing = true;
  }

  onPostEditCancel(): void {
    this._startEditing = false;
  }

  onReply($event: Comment): void {
    this._post.commentsCount++;
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
