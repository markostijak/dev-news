import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent {
  private firstName: FormControl = new FormControl();
  private lastName: FormControl = new FormControl();
  private username: FormControl = new FormControl();
  private email: FormControl = new FormControl();
  private password: FormControl = new FormControl();
  private confirmPassword: FormControl = new FormControl();

  constructor() {

  }

}
