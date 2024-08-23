import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { AccordionApprenticeComponent } from '../accordion-apprentice/accordion-apprentice.component';
import { ButtonProfileApprenticeComponent } from '../button-profile-apprentice/button-profile-apprentice.component';
import { NgClass, NgIf } from '@angular/common';
import { ButtonMenuCounterComponent } from 'src/app/shared/button-menu-counter/button-menu-counter.component';
import { ButtonMenuComponent } from 'src/app/shared/button-menu/button-menu.component';
import { ButtonMyCoursesComponent } from '../button-my-courses/button-my-courses.component';
import { AccordionMyCoursesComponent } from '../accordion-my-courses/accordion-my-courses.component';
import { ROUTES } from 'src/app/shared/constants';

@Component({
  selector: 'app-main-page-menu-apprentice',
  templateUrl: './main-page-menu-apprentice.component.html',
  styleUrls: ['./main-page-menu-apprentice.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    ButtonMenuCounterComponent,
    ButtonProfileApprenticeComponent,
    ButtonMyCoursesComponent,
    AccordionApprenticeComponent,
    AccordionMyCoursesComponent,
    ButtonMenuComponent,
  ],
})
export class MainPageMenuApprenticeComponent implements OnInit, OnDestroy {
  numberProductsCar: number = NaN;
  actualId: number;
  isAccordion: boolean;
  isAccordionMyCourses: boolean;
  dataTotalCartShop: number = 0;

  suscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.actualId = data.actualId;
        this.isAccordion = data.isAccordion;
        this.isAccordionMyCourses = data.isAccordionMyCourses;
        this.dataTotalCartShop = data.dataCartShop.length;
      });

    this.suscription.add(suscruption1);
  }

  handleClickButton(id: number) {
    if (id === -1) {
      localStorage.clear();
      this.router.navigate(['home']);
    }
  }

  handleClickButtons() {
    this.router.navigate([ROUTES.USER_APPRENTICE]);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
