import {Component, OnDestroy, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {Post} from '../../models/post';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../services/navigation/navigation.service';
import {forkJoin, Subscription} from 'rxjs';
import {TimeAgoService} from '../../services/time-ago/time-ago.service';
import {Data} from '../../components/comment/comment-editor/comment-editor.component';
import {Comment} from '../../models/comment';
import {PostService} from '../../services/post/post.service';
import {AuthorizationService} from '../../services/authorization/authorization.service';

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
  private _timeFormatter: TimeAgoService;
  private _activatedRoute: ActivatedRoute;
  private _navigationService: NavigationService;
  private _authorizationService: AuthorizationService;

  private _startEditing: boolean = false;
  private _subscription: Subscription = new Subscription();

  constructor(postService: PostService,
              timeFormatter: TimeAgoService,
              activatedRoute: ActivatedRoute,
              navigationService: NavigationService,
              authorizationService: AuthorizationService) {

    this._postService = postService;
    this._timeFormatter = timeFormatter;
    this._activatedRoute = activatedRoute;
    this._navigationService = navigationService;
    this._authorizationService = authorizationService;
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

  private reload(alias: string): void {
    this._postService.fetchByAlias(alias, 'include-stats').subscribe(post => {
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
    if (this._authorizationService.canCreate()) {
      this._postService.addComment({content: $event.content, post: this._post._links.self.href} as Comment).subscribe(comment => {
        comment.createdBy = this._authorizationService.authentication.principal;
        this._comments.push(comment);
        this.post.commentsCount++;
        $event.editor.reset();
      });
    }
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

  get comments(): Comment[] {
    return this._comments;
  }

  get startEditing(): boolean {
    return this._startEditing;
  }

  get authorizationService(): AuthorizationService {
    return this._authorizationService;
  }
}
