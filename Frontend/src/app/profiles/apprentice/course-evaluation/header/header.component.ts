import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormSearchCoursesComponent } from '../../profile/header-apprentice/form-search-courses/form-search-courses.component';
import { ProfileApprenticeComponent } from '../../profile/header-apprentice/profile-apprentice/profile-apprentice.component';
import { DataUserRegister } from 'src/app/shared/interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { Subscription } from 'rxjs';
import { selectDataShared } from 'src/app/store/selectors/global.selector';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/shared/constants';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { setFilterModulesSubmodules } from 'src/app/store/actions/user-menu-apprentice.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css',
    '../../profile/header-apprentice/form-search-courses/form-search-courses.component.css',
  ],
  standalone: true,
  imports: [
    FormSearchCoursesComponent,
    ProfileApprenticeComponent,
    ReactiveFormsModule,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  dataUser?: DataUserRegister = undefined;

  form: FormGroup = this.fb.group({
    courseName: [''],
  });

  suscription: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.handleChangeForm();

    const suscruption1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.dataUser = data.dataUserRegister;
      });

    this.suscription.push(suscruption1);
  }

  handleNavigateProfile() {
    this.router.navigate([ROUTES.USER_APPRENTICE]);
  }

  handleChangeForm() {
    const suscription = this.form.valueChanges.subscribe((values) => {
      this.store.dispatch(
        setFilterModulesSubmodules({ valueForm: values.courseName })
      );
    });

    this.suscription.push(suscription);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
