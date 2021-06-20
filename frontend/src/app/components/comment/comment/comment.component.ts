import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Data, ReplyEditorComponent} from '../reply-editor/reply-editor.component';
import {Post} from '../../../domain/post/post';
import {Comment} from '../../../domain/comment/comment';
import {CommentService} from '../../../domain/comment/comment.service';
import {Authorization} from '../../../domain/authorization/authorization.service';
import {State} from '../../../domain/state';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input()
  post: Post;

  @Input()
  comment: Comment;

  @Input()
  depth: number = 0;

  @Output()
  reply: EventEmitter<Comment> = new EventEmitter<Comment>();

  @Output()
  delete: EventEmitter<Comment> = new EventEmitter<Comment>();

  showEditor: boolean = false;
  startEditing: boolean = false;
  loadMore: boolean = false;
  isAuthor: boolean;

  state: State;
  authorization: Authorization;

  private commentService: CommentService;

  constructor(state: State, commentService: CommentService, authorization: Authorization) {
    this.state = state;
    this.authorization = authorization;
    this.commentService = commentService;
  }

  ngOnInit(): void {
    this.isAuthor = this.state.user && this.state.user.username === this.comment._embedded.createdBy.username;
    this.commentService.fetchPage(this.comment._links.replies)
      .subscribe(([replies, page]) => {
        this.comment.replies = replies;
      });
  }

  public toggleReplyEditor(): void {
    this.showEditor = !this.showEditor;
  }

  public toggleEditEditor(): void {
    this.startEditing = !this.startEditing;
  }

  public onSave($event: Data): void {
    const reply = {content: $event.content} as Comment;
    this.commentService.addReply(this.post, this.comment, reply).subscribe(response => {
      if (!this.comment.replies) {
        this.comment.replies = [];
      }

      response._embedded.createdBy = this.state.user;
      this.comment.replies.push(response);
      this.showEditor = false;
      $event.editor.reset();
      this.onReply(reply);
    });
  }

  public onCancel($event: ReplyEditorComponent): void {
    $event.reset();
    this.showEditor = false;
  }

  public onEditSave($event: Data): void {
    this.commentService.update(this.comment, $event.content).subscribe(response => {
      this.comment.content = response.content;
      this.comment.updatedAt = response.updatedAt;
      this.startEditing = false;
      $event.editor.reset();
    });
  }

  public onEditCancel($event: ReplyEditorComponent): void {
    $event.reset();
    this.startEditing = false;
  }

  public onReply(reply: Comment): void {
    this.reply.emit(reply);
  }

  public onDelete(comment: Comment): void {
    this.delete.emit(comment);
  }

  public deleteReply(deleted: Comment): void {
    this.commentService.delete(deleted).subscribe(() => {
      if (this.comment.replies) {
        const index = this.comment.replies.indexOf(deleted);
        this.comment.replies.splice(index, 1);
        this.post.commentsCount--;
      }
    });
  }

}
