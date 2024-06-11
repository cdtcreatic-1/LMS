import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { CarShopComponent } from '../car-shop/car-shop.component';
import { DetailsCourseComponent } from '../details-course/details-course.component';
import { MyCoursesComponent } from '../my-courses/my-courses.component';
import { AllCoursesComponent } from '../all-courses/all-courses.component';
import { NgIf } from '@angular/common';
import { UpdatePasswordComponent } from 'src/app/profiles/shared/update-password/update-password.component';
import { EditProfileApprenticeComponent } from '../edit-profile-apprentice/edit-profile-apprentice.component';
import { MainPageNotificationComponent } from '../notification-apprentice/main-page-notification/main-page-notification.component';
import { CourseRecomenderComponent } from '../course-recomender/course-recomender.component';

@Component({
  selector: 'app-main-page-body-apprentice',
  templateUrl: './main-page-body-apprentice.component.html',
  styleUrls: ['./main-page-body-apprentice.component.css'],
  standalone: true,
  imports: [
    NgIf,
    AllCoursesComponent,
    MyCoursesComponent,
    DetailsCourseComponent,
    CarShopComponent,
    UpdatePasswordComponent,
    EditProfileApprenticeComponent,
    MainPageNotificationComponent,
    CourseRecomenderComponent,
  ],
})
export class MainPageBodyApprenticeComponent implements OnDestroy {
  actualId: number;
  isEditProfile: boolean = false;

  suscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {
    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.actualId = data.actualId;
        this.isEditProfile = data.isEditProfile;
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
