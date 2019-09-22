import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from '../../../models/comment';
import {TimeAgoService} from '../../../services/time-ago/time-ago.service';
import {Data, ReplyEditorComponent} from '../reply-editor/reply-editor.component';
import {CommentService} from '../../../services/comment/comment.service';
import {Post} from '../../../models/post';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input()
  private comment: Comment;

  @Input()
  private post: Post;

  @Output()
  private reply: EventEmitter<Comment>;

  private _showEditor: boolean = false;
  private _startEditing: boolean = false;

  private _commentService: CommentService;
  private readonly _timeFormatter: TimeAgoService;

  constructor(commentService: CommentService, timeFormatter: TimeAgoService) {
    this._timeFormatter = timeFormatter;
    this._commentService = commentService;
    this.reply = new EventEmitter<Comment>();
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
      reply.createdBy = this.comment.createdBy;

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

  get timeFormatter(): TimeAgoService {
    return this._timeFormatter;
  }

  get showEditor(): boolean {
    return this._showEditor;
  }

  get startEditing(): boolean {
    return this._startEditing;
  }
}
