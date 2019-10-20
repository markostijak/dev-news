import {Component, OnInit} from '@angular/core';
import {Authentication, AuthenticationService} from './services/authentication/authentication.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private _router: Router;
  private readonly _authentication: Observable<Authentication>;

  constructor(router: Router, authenticationService: AuthenticationService) {
    this._router = router;
    this._authentication = authenticationService.authentication;
  }

  ngOnInit(): void {

  }

  public onSearch($event): void {
    this._router.navigate(['/search'], {
      queryParams: {
        term: $event
      }
    });
  }

  get authentication(): Observable<Authentication> {
    return this._authentication;
  }

}
