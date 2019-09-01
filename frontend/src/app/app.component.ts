import {Component, OnInit} from '@angular/core';
import {Authentication, AuthenticationService} from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private _mobile: boolean = false;
  private _authentication: Authentication;

  constructor(authenticationService: AuthenticationService) {
    authenticationService.authentication.subscribe(authentication => {
      this._authentication = authentication;
    });
  }

  ngOnInit(): void {

  }

  public get authentication(): Authentication {
    return this._authentication;
  }

}
