import {Component, OnInit} from '@angular/core';
import {LOGIN, NavigationService} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(LOGIN);
  }

}
