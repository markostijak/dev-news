import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../../../domain/utils/dialog.service';
import {AuthenticationProcessor} from '../../../domain/authentication/authentication-porcessor';
import {User} from '../../../domain/user/user';

@Component({
  selector: 'app-user-menu-item',
  templateUrl: './user-menu-item.component.html',
  styleUrls: ['./user-menu-item.component.scss']
})
export class UserMenuItemComponent implements OnInit {

  @Input()
  public user: User;

  private dialogService: DialogService;
  private authenticationProcessor: AuthenticationProcessor;

  constructor(dialogService: DialogService, authenticationProcessor: AuthenticationProcessor) {
    this.dialogService = dialogService;
    this.authenticationProcessor = authenticationProcessor;
  }

  public ngOnInit(): void {
  }

  public logout(): void {
    this.authenticationProcessor.onLogout().subscribe(() => {
      window.location.reload();
    });
  }

  public showDialog(which: string): void {
    this.dialogService.show(which);
  }

}
