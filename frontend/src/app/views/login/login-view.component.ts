import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Authentication} from '../../domain/authentication/authentication';
import {AuthenticationProcessor} from '../../domain/authentication/authentication-porcessor';
import {State} from '../../domain/state';
import {LOGIN} from '../../domain/utils/navigation';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  private state: State;
  private router: Router;
  private authenticationProcessor: AuthenticationProcessor;

  constructor(state: State, router: Router, authenticationProcessor: AuthenticationProcessor) {
    this.state = state;
    this.router = router;
    this.authenticationProcessor = authenticationProcessor;
  }

  ngOnInit(): void {
    this.state.navigation$.next(LOGIN);
  }

  public redirect($event: Authentication): void {
    this.authenticationProcessor.onLogin($event).subscribe(() => {
      this.router.navigate(['']);
    });
  }

}
