import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent {
  firstName: FormControl = new FormControl();
  lastName: FormControl = new FormControl();
  username: FormControl = new FormControl();
  email: FormControl = new FormControl();
  password: FormControl = new FormControl();
  confirmPassword: FormControl = new FormControl();
}
