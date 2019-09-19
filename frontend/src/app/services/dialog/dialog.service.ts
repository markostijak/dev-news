import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Authentication, AuthenticationService} from '../authentication/authentication.service';
import {ComponentType} from '@angular/cdk/portal';
import {CreatePostDialogComponent} from '../../components/post/create-post-dialog/create-post-dialog.component';
import {CreateCommunityDialogComponent} from '../../components/community/create-community-dialog/create-community-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private _router: Router;
  private _dialog: MatDialog;
  private _authentication: Authentication;

  constructor(dialog: MatDialog, authenticationService: AuthenticationService, router: Router) {
    this._router = router;
    this._dialog = dialog;
    authenticationService.authentication.subscribe(authentication => {
      this._authentication = authentication;
    });
  }

  public showDialog(dialog: ComponentType<any>): MatDialogRef<CreatePostDialogComponent | CreateCommunityDialogComponent> {
    if (this._authentication.authenticated) {
      return this._dialog.open(dialog, {
        width: '100%',
        maxWidth: '600px'
      });
    } else {
      this._router.navigate(['login']);
      return null;
    }
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
