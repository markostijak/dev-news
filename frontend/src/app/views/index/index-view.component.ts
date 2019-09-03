import {Component} from '@angular/core';
import {Authentication, AuthenticationService} from '../../services/authentication/authentication.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-index-view',
  templateUrl: './index-view.component.html',
  styleUrls: ['./index-view.component.scss']
})
export class IndexViewComponent {

  private readonly _authentication: Observable<Authentication>;

  constructor(authenticationService: AuthenticationService) {
    this._authentication = authenticationService.authentication;
  }

  public get authentication(): Observable<Authentication> {
    return this._authentication;
  }

}
