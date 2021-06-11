import {Component, OnInit} from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Router} from '@angular/router';
import {State} from '../../domain/state';
import {SIGN_UP} from '../../domain/utils/navigation';
import {AuthenticationProcessor} from '../../domain/authentication/authentication-porcessor';
import {Authentication} from '../../domain/authentication/authentication';

@Component({
  selector: 'app-sign-up-view',
  templateUrl: './sign-up-view.component.html',
  styleUrls: ['./sign-up-view.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class SignUpViewComponent implements OnInit {

  private state: State;
  private router: Router;
  private authenticationProcessor: AuthenticationProcessor;

  constructor(state: State, router: Router, authenticationProcessor: AuthenticationProcessor) {
    this.state = state;
    this.router = router;
    this.authenticationProcessor = authenticationProcessor;
  }

  ngOnInit(): void {
    this.state.navigation$.next(SIGN_UP);
  }

  public success(authentication: Authentication): void {
    this.authenticationProcessor.onLogin(authentication).subscribe(value => {
      this.router.navigate(['']);
    });
  }

}
