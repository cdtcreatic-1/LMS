import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/shared/constants';

@Component({
    selector: 'app-main-page-admin-login',
    templateUrl: './main-page-admin-login.component.html',
    styleUrls: ['./main-page-admin-login.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule],
})
export class MainPageAdminLoginComponent {
  dataRef = {
    userName: 'CreaticDev',
    password: 'CreaticDev2023*',
  };

  formLogin: FormGroup = this.fb.group({
    email: [
      '',
      [Validators.email, Validators.required, Validators.maxLength(50)],
    ],
    password: ['', [Validators.required, Validators.maxLength(18)]],
  });

  constructor(private fb: FormBuilder, private router: Router) {
    localStorage.clear();
  }

  ngOnInit() {}

  onSubmit() {
    if (
      this.formLogin.get('email')?.value === this.dataRef.userName &&
      this.formLogin.get('password')?.value === this.dataRef.password
    ) {
      localStorage.setItem('@adminLogin', 'true');
      this.router.navigate([ROUTES.HOME]);
    }
  }
}
