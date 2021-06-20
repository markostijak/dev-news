import {Component, OnInit} from '@angular/core';
import {State} from '../../domain/state';
import {User} from '../../domain/user/user';
import {UserService} from '../../domain/user/user.service';
import {AuthenticationStore} from '../../domain/authentication/authentication-store';
import {FileService} from '../../domain/utils/file.service';
import {MatSnackBar} from '@angular/material';
import {SubscriptionSupport} from '../../domain/utils/subscription-support';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-settings-view',
  templateUrl: './user-settings-view.component.html',
  styleUrls: ['./user-settings-view.component.scss']
})
export class UserSettingsViewComponent extends SubscriptionSupport implements OnInit {

  user: User;
  authenticatedDevice: string;

  private state: State;
  private userService: UserService;
  private fileService: FileService;
  private snackBar: MatSnackBar;
  private authenticationStore: AuthenticationStore;

  constructor(state: State, authenticationStore: AuthenticationStore,
              userService: UserService, filesService: FileService, snackBar: MatSnackBar) {
    super();
    this.state = state;
    this.snackBar = snackBar;
    this.userService = userService;
    this.fileService = filesService;
    this.authenticationStore = authenticationStore;
  }

  public ngOnInit(): void {
    this.state.navigation$.next({
      icon: 'settings',
      title: 'User Settings'
    });

    this.userService.fetch(this.state.user._links.self, 'profile').subscribe(user => this.user = user);
    this.authenticationStore.pipe(takeUntil(this.destroyed$)).subscribe(authentication => {
      if (authentication.authenticated) {
        // @ts-ignore
        this.authenticatedDevice = authentication.principal.device;
      }
    });
  }

  logout(device: any): void {
    this.userService.revokeDevice(this.user, device.token).subscribe(() => {
      // @ts-ignore
      this.user.devices = this.user.devices.filter(d => d !== device);
      this.snackBar.open(`Successfully logged out from ${device.agent} on ${device.os} ${device.osVersion}`, 'OK', {
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
        duration: 5000
      });
    });
  }

  save(user: User): void {
    if (user.picture && user.picture.startsWith('data')) {
      this.fileService.uploadDataUrl(user.picture).subscribe(url => {
        user.picture = url;
        this.updateUser(user);
      });
    } else {
      this.updateUser(user);
    }
  }

  public updateUser(user: User): void {
    this.userService.update(user).subscribe(() => {
      this.state.user$.next({
        ...this.state.user,
        lastName: user.lastName,
        firstName: user.firstName,
        username: user.username,
        picture: user.picture
      });

      this.snackBar.open('Saved', 'OK', {
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
        duration: 5000
      });
    });
  }

}
