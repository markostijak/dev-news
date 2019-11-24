import {Component, OnInit} from '@angular/core';
import {NavigationService, SIGN_UP} from '../../services/navigation/navigation.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Router} from '@angular/router';
import {Authentication} from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-sign-up-view',
  templateUrl: './sign-up-view.component.html',
  styleUrls: ['./sign-up-view.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpViewComponent implements OnInit {


  private _router: Router;
  private _navigationService: NavigationService;

  constructor(router: Router, navigationService: NavigationService) {
    this._router = router;
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(SIGN_UP);
  }

  public redirect($event: Authentication): void {
    this._router.navigate(['']);
  }

}
