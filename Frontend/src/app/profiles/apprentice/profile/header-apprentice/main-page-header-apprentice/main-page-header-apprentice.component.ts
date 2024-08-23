import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { ProfileApprenticeComponent } from '../profile-apprentice/profile-apprentice.component';
import { FormSearchCoursesComponent } from '../form-search-courses/form-search-courses.component';

@Component({
    selector: 'app-main-page-header-apprentice',
    templateUrl: './main-page-header-apprentice.component.html',
    styleUrls: ['./main-page-header-apprentice.component.css'],
    standalone: true,
    imports: [FormSearchCoursesComponent, ProfileApprenticeComponent],
})
export class MainPageHeaderApprenticeComponent implements OnDestroy {
  actualId: number;

  suscription = new Subscription();

  constructor(private store: Store<AppState>) {
    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.actualId = data.actualId;
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
