import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { User } from '../../../../interfaces/services/user.service';

import { fadeIn } from 'src/app/animations/form-error';
import {AuthenticationService} from '../../../../user/_services/authentication.service';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {first} from 'rxjs/operators';

@Component({
  selector: 'page-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../sign-in/sign-in.component.scss'],
  animations: [fadeIn]
})
export class PageSignUpComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  types = [
    {
      value: 'MENTOR',
      label: 'Teacher',
    }, {
      value: 'STUDENT',
      label: 'Student',
    }
  ];
  role:any = null;

  constructor(private router: Router,
              private http: HttpClient,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.required]),
      lastName: new FormControl('', [Validators.required, Validators.required]),
      type: new FormControl('', [Validators.required, Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirm: new FormControl('', [Validators.required, Validators.minLength(5)])
    }, { validators: this.MatchPassword, updateOn: 'blur' });
  }

  signUp() {
    if (
        this.username.invalid ||
        this.firstName.invalid ||
        this.lastName.invalid ||
        this.type.invalid ||
        this.email.invalid ||
        this.password.invalid ||
        this.confirm.invalid
    ) {
      this.toastr.error('Please fill all required fields', 'Error', { closeButton: true });
      this.loading = false;
      return;
    }

    // tslint:disable-next-line:label-position
    const newUser: User = {
      username:  this.email.toString(),
      firstName: this.firstName.toString(),
      lastName: this.lastName.toString(),
      email: this.email.toString(),
      password: this.password.toString(),
      type: this.type.toString()
    };
    // this.router.navigate(['']);
    this.authenticationService.register(newUser)
        .pipe(first())
        .subscribe(
            data => {
              if (data.status) {
                this.toastr.success('Welcome!', 'Success', {closeButton: true});
                this.router.navigate(['/vertical/user-profile']).then(r => {});
              } else {
                this.toastr.error(data.message, 'Error', { closeButton: true });
                this.error = data.message;
                this.loading = false;
              }
            },
            error => {
              this.toastr.error(error.message, 'Error', { closeButton: true });
              this.error = error;
              this.loading = false;
            });
  }

  MatchPassword(ac: AbstractControl): ValidatorFn {
    const pass = ac.get('password').value;
    const confirmPass = ac.get('confirm').value;

    if (pass !== confirmPass) {
      ac.get('confirm').setErrors({ notMatch: true });
    }

    return null;
  }

  get username() {
    return this.loginForm.get('username').value;
  }

  get firstName() {
    return this.loginForm.get('firstName').value;
  }

  get lastName() {
    return this.loginForm.get('lastName').value;
  }

  get email() {
    return this.loginForm.get('email').value;
  }

  get password() {
    return this.loginForm.get('password').value;
  }

  get type() {
    return this.loginForm.get('type').value;
  }

  get confirm() {
    return this.loginForm.get('confirm').value;
  }

  onChange(value) {
    if (value) {
      this.loginForm.controls['type'].setValue(value);
    }
  }
}

