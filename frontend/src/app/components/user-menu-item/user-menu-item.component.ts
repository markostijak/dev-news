import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {DialogService} from '../../services/dialog/dialog.service';

@Component({
  selector: 'app-user-menu-item',
  templateUrl: './user-menu-item.component.html',
  styleUrls: ['./user-menu-item.component.scss']
})
export class UserMenuItemComponent implements OnInit {

  @Input()
  private user: User;

  private _dialogService: DialogService;
  private _authenticationService: AuthenticationService;

  constructor(dialogService: DialogService, authenticationService: AuthenticationService) {
    this._dialogService = dialogService;
    this._authenticationService = authenticationService;
  }

  public ngOnInit(): void {
  }

  public logout(): void {
    this._authenticationService.logout().subscribe(() => {
      window.location.reload();
    });
  }

  public showDialog(which: string): void {
    this._dialogService.show(which);
  }

}
