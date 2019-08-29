import {Component, OnInit} from '@angular/core';
import {NavigationService, SIGN_UP} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-sign-up-view',
  templateUrl: './sign-up-view.component.html',
  styleUrls: ['./sign-up-view.component.scss']
})
export class SignUpViewComponent implements OnInit {

  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(SIGN_UP);
  }

}
