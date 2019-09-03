import {Component, OnInit} from '@angular/core';
import {Authentication, AuthenticationService} from './services/authentication/authentication.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly _authentication: Observable<Authentication>;

  constructor(authenticationService: AuthenticationService) {
    this._authentication = authenticationService.authentication;
  }

  ngOnInit(): void {

  }

  get authentication(): Observable<Authentication> {
    return this._authentication;
  }

}
