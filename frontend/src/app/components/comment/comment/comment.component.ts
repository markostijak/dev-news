import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from '../../../models/comment';
import {Data, ReplyEditorComponent} from '../reply-editor/reply-editor.component';
import {CommentService} from '../../../services/comment/comment.service';
import {Post} from '../../../models/post';
import {AuthorizationService} from '../../../services/authorization/authorization.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input()
  public post: Post;

  @Input()
  public comment: Comment;

  @Output()
  public reply: EventEmitter<Comment> = new EventEmitter<Comment>();

  private _showEditor: boolean = false;
  private _startEditing: boolean = false;

  private _commentService: CommentService;
  private _authorizationService: AuthorizationService;

  constructor(commentService: CommentService, authorizationService: AuthorizationService) {
    this._commentService = commentService;
    this._authorizationService = authorizationService;
  }

  ngOnInit(): void {
  }

  public toggleReplyEditor(): void {
    this._showEditor = !this._showEditor;
  }

  public toggleEditEditor(): void {
    this._startEditing = !this._startEditing;
  }

  public onSave($event: Data): void {
    this._commentService.create({
      content: $event.content,
      post: this.post._links.self.href,
      parent: this.comment._links.self.href
    } as Comment).subscribe(reply => {
      reply.createdBy = this._authorizationService.authentication.principal;

      if (!this.comment.replies) {
        this.comment.replies = [];
      }

      this.comment.replies.push(reply);
      this._showEditor = false;
      $event.editor.reset();
      this.onReply(reply);
    });
  }

  public onCancel($event: ReplyEditorComponent): void {
    $event.reset();
    this._showEditor = false;
  }

  public onEditSave($event: Data): void {
    this._commentService.update({
      content: $event.content,
      _links: this.comment._links
    } as Comment).subscribe(comment => {
      this.comment.content = comment.content;
      this.comment.updatedAt = comment.updatedAt;
      $event.editor.reset();
      this._startEditing = false;
    });
  }

  public onEditCancel($event: ReplyEditorComponent): void {
    $event.reset();
    this._startEditing = false;
  }

  public onReply(reply: Comment): void {
    this.reply.emit(reply);
  }

  get showEditor(): boolean {
    return this._showEditor;
  }

  get startEditing(): boolean {
    return this._startEditing;
  }

  get authorizationService(): AuthorizationService {
    return this._authorizationService;
  }

}
