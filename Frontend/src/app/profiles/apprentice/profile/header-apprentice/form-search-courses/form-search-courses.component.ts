import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  setChangeActualIdApprentice,
  setFilterCourses,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-form-search-courses',
  templateUrl: './form-search-courses.component.html',
  styleUrls: ['./form-search-courses.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class FormSearchCoursesComponent implements OnInit, OnDestroy {
  form: FormGroup = this.fb.group({
    courseName: [''],
  });

  suscription: Subscription[] = [];

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.handleChangeForm();
  }

  handleChangeForm() {
  
    const suscription = this.form.valueChanges.subscribe((values) => {
      this.store.dispatch(setChangeActualIdApprentice({ value: 1 }));
      this.store.dispatch(setFilterCourses({ courseName: values.courseName }));
    });

    this.suscription.push(suscription);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
