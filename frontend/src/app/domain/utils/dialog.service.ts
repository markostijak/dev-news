import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ComponentType} from '@angular/cdk/portal';
import {CreatePostDialogComponent} from '../../components/post/create-post-dialog/create-post-dialog.component';
import {CreateCommunityDialogComponent} from '../../components/community/create-community-dialog/create-community-dialog.component';
import {Authorization} from '../authorization/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private _router: Router;
  private _dialog: MatDialog;
  private _authorization: Authorization;

  constructor(dialog: MatDialog, router: Router, authorizationService: Authorization) {
    this._router = router;
    this._dialog = dialog;
    this._authorization = authorizationService;
  }

  public showDialog(dialog: ComponentType<any>): MatDialogRef<CreatePostDialogComponent | CreateCommunityDialogComponent> {
    if (!this._authorization.canCreate()) {
      this._router.navigate(['login']);
      return null;
    }

    return this._dialog.open(dialog, {
      width: '100%',
      maxWidth: '600px'
    });
  }

  public show(which: string): MatDialogRef<CreatePostDialogComponent | CreateCommunityDialogComponent> {
    switch (which) {
      case 'post':
        return this.showDialog(CreatePostDialogComponent);
      case 'community':
        return this.showDialog(CreateCommunityDialogComponent);
    }
  }

}
