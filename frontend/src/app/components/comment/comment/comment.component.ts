import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../../models/comment';
import {TimeAgoService} from '../../../services/time-ago/time-ago.service';
import {Data, ReplyEditorComponent} from '../reply-editor/reply-editor.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input()
  private comment: Comment;

  private _showEditor: boolean = false;
  private _startEditing: boolean = false;

  private readonly _timeFormatter: TimeAgoService;

  constructor(timeFormatter: TimeAgoService) {
    this._timeFormatter = timeFormatter;
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
    const comment = new Comment();
    comment.createdBy = this.comment.createdBy;
    comment.createdAt = this.comment.createdAt;
    comment.content = $event.content;

    if (!this.comment.replies) {
      this.comment.replies = [];
    }

    this.comment.replies.push(comment);
    this._showEditor = false;
    $event.editor.reset();
  }

  public onCancel($event: ReplyEditorComponent): void {
    $event.reset();
    this._showEditor = false;
  }

  public onEditSave($event: Data): void {
    this.comment.content = $event.content;
    $event.editor.reset();
    this._startEditing = false;
  }

  public onEditCancel($event: ReplyEditorComponent): void {
    $event.reset();
    this._startEditing = false;
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
