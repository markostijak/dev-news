import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../domain/user/user';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../../domain/user/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @Input()
  public user: User;

  @Output()
  public save: EventEmitter<User> = new EventEmitter<User>();

  form: FormGroup;
  imagePreview: string;
  image: string = null;

  private formBuilder: FormBuilder;
  private userService: UserService;

  constructor(formBuilder: FormBuilder, userService: UserService) {
    this.formBuilder = formBuilder;
    this.userService = userService;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(5)], this.usernameValidator()],
    });

    this.form.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      username: this.user.username,
    });
  }

  private usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.userService.existsByUsername(control.value)
        .pipe(map(exists => {
          return control.value !== this.user.username && exists ? {alreadyTaken: true} : null;
        }));
    };
  }

  public submit($event: Event): void {
    if (!this.form.valid) {
      return;
    }

    this.save.emit({
      ...this.user,
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      username: this.form.controls['username'].value,
      picture: this.imagePreview || this.user.picture,
    });
  }

  onImageSelect($event: any): void {
    const image = $event.target.files[0];
    if (image) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
        this.image = image;
      };

      reader.readAsDataURL(image);
    }
  }

}
