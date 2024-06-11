import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarNotificationComponent } from '../navbar-notification/navbar-notification.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';
import { NewCoursesComponent } from '../new-courses/new-courses.component';
import { FinishCoursesComponent } from '../finish-courses/finish-courses.component';
import { OldCoursesComponent } from '../old-courses/old-courses.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main-page-notification',
  templateUrl: './main-page-notification.component.html',
  styleUrls: ['./main-page-notification.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NavbarNotificationComponent,
    NewCoursesComponent,
    FinishCoursesComponent,
    OldCoursesComponent,
  ],
})
export class MainPageNotificationComponent implements OnInit, OnDestroy {
  idNavBar: number = 1;

  suscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.suscription = this.store.select(selectApprentice).subscribe((data) => {
      this.idNavBar = data.idNavbarNotification;
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
