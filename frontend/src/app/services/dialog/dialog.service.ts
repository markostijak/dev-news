import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
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

  public showDialog(dialog: ComponentType<any>): void {
    if (this._authentication.authenticated) {
      this._dialog.open(dialog, {
        width: '100%',
        maxWidth: '600px'
      });
    } else {
      this._router.navigate(['login']);
    }
  }

  public show(which: string): void {
    switch (which) {
      case 'post':
        this.showDialog(CreatePostDialogComponent);
        break;
      case 'community':
        this.showDialog(CreateCommunityDialogComponent);
        break;
    }
  }

}
