import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent {
  private _firstName: FormControl = new FormControl();
  private _lastName: FormControl = new FormControl();
  private _username: FormControl = new FormControl();
  private _email: FormControl = new FormControl();
  private _password: FormControl = new FormControl();
  private _confirmPassword: FormControl = new FormControl();

  constructor() {

  }

  get firstName(): FormControl {
    return this._firstName;
  }

  get lastName(): FormControl {
    return this._lastName;
  }

  get username(): FormControl {
    return this._username;
  }

  get email(): FormControl {
    return this._email;
  }

  get password(): FormControl {
    return this._password;
  }

  get confirmPassword(): FormControl {
    return this._confirmPassword;
  }
}
