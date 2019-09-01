import {Component} from '@angular/core';
import {Authentication, AuthenticationService} from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-index-view',
  templateUrl: './index-view.component.html',
  styleUrls: ['./index-view.component.scss']
})
export class IndexViewComponent {

  private _authentication: Authentication;

  constructor(authenticationService: AuthenticationService) {
    authenticationService.authentication.subscribe(authentication => {
      this._authentication = authentication;
    });
  }

  public get authentication(): Authentication {
    return this._authentication;
  }

}
