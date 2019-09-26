import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {Post} from '../../../models/post';

@Component({
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent {

  private _router: Router;
  private _dialog: MatDialogRef<CreatePostDialogComponent>;

  constructor(router: Router, dialog: MatDialogRef<CreatePostDialogComponent>) {
    this._router = router;
    this._dialog = dialog;
  }

  public close(): void {
    this._dialog.close();
  }

  public onSave(post: Post): void {
    this._router.navigate(['/c', post.community.alias, 'p', post.alias]);
    this._dialog.close();
  }

}
