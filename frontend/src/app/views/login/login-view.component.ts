import {Component, OnInit} from '@angular/core';
import {LOGIN, NavigationService} from '../../services/navigation/navigation.service';
import {Authentication} from '../../services/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  private _router: Router;
  private _navigationService: NavigationService;

  constructor(router: Router, navigationService: NavigationService) {
    this._router = router;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(LOGIN);
  }

  public redirect($event: Authentication): void {
    this._router.navigate(['']);
  }

}
