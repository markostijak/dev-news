import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Data} from '../../components/comment/comment-editor/comment-editor.component';
import {Post} from '../../domain/post/post';
import {Community} from '../../domain/community/community';
import {PostService} from '../../domain/post/post.service';
import {Authorization} from '../../domain/authorization/authorization.service';
import {SubscriptionSupport} from '../../domain/utils/subscription-support';
import {State} from '../../domain/state';
import {takeUntil} from 'rxjs/operators';
import {CommunityService} from '../../domain/community/community.service';
import {Comment} from '../../domain/comment/comment';
import {CommentService} from '../../domain/comment/comment.service';


@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent extends SubscriptionSupport implements OnInit, OnDestroy {

  post: Post;
  community: Community;
  trending: Post[] = [];
  comments: Comment[] = [];
  startEditing: boolean = false;
  isAuthor: boolean = false;
  commentsCount: number = 0;

  state: State;
  authorization: Authorization;

  private router: Router;
  private postService: PostService;
  private commentService: CommentService;
  private communityService: CommunityService;
  private activatedRoute: ActivatedRoute;

  constructor(state: State,
              router: Router,
              postService: PostService,
              commentService: CommentService,
              communityService: CommunityService,
              activatedRoute: ActivatedRoute,
              authorization: Authorization) {
    super();
    this.state = state;
    this.router = router;
    this.postService = postService;
    this.commentService = commentService;
    this.communityService = communityService;
    this.activatedRoute = activatedRoute;
    this.authorization = authorization;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.community = null;
      this.reload(params['post']);
    });
  }

  private reload(alias: string): void {
    this.postService.fetchByAlias(alias, 'stats').subscribe(post => {
      this.state.navigation$.next(post.community);
      this.communityService.fetch(post._links.community).subscribe(c => this.community = c);
      this.postService.fetchComments(post).subscribe(([c, page]) => this.comments = c);
      this.postService.fetchTrending().subscribe(([p, page]) => this.trending = p);
      this.post = post;
      this.isAuthor = this.state.user && post.createdBy.username === this.state.user.username;
      this.commentsCount = post.commentsCount;
    }, () => this.router.navigate(['page-not-found']));
  }

  onSave($event: Data): void {
    if (this.authorization.canCreate()) {
      const comment = {content: $event.content};
      this.commentService.create(this.post, comment as Comment)
        .subscribe(response => {
          response._embedded.createdBy = this.state.user;
          this.comments.push(response);
          this.commentsCount++;
          $event.editor.reset();
        });
    }
  }

  onPostEditSave(content: string): void {
    this.postService.update(this.post, content).subscribe(post => {
      this.post.content = post.content;
      this.post.updatedAt = post.updatedAt;
      this.startEditing = false;
    });
  }

  showEditor(): void {
    this.startEditing = true;
  }

  onPostEditCancel(): void {
    this.startEditing = false;
  }

  onReply($event: any): void {
    this.commentsCount++;
  }

  public delete(post: Post): void {
    this.postService.delete(post).subscribe(() => {
      this.router.navigate(['/c', post.community.alias]);
    });
  }

  public deleteComment(deleted: Comment): void {
    this.commentService.delete(deleted).subscribe(() => {
      const index = this.comments.indexOf(deleted);
      this.comments.splice(index, 1);
      this.commentsCount--;
    });
  }

}
