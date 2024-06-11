import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { LoadPhotoComponent } from './load-photo/load-photo.component';
import { QGraderCertificationComponent } from './q-grader-certification/q-grader-certification.component';
import { ReviewCoffeeComponent } from './review-coffee/review-coffee.component';
import { PriceCoffeeComponent } from './price-coffee/price-coffee.component';
import { TypeCoffeeComponent } from './type-cofee/type-coffee.component';
import { NgIf } from '@angular/common';
import { TitleAddLotsComponent } from './title-add-lots/title-add-lots.component';
import { DataUserFarmer } from 'src/app/register/register-farmer/interface';
import { ByStepsComponent } from 'src/app/shared/by-steps/by-steps.component';

@Component({
  selector: 'app-app-lots',
  templateUrl: './add-lots.component.html',
  standalone: true,
  imports: [
    TitleAddLotsComponent,
    NgIf,
    TypeCoffeeComponent,
    PriceCoffeeComponent,
    ReviewCoffeeComponent,
    QGraderCertificationComponent,
    LoadPhotoComponent,
    ByStepsComponent,
  ],
})
export class AddLotsComponent implements OnInit, OnDestroy {
  actualId: number = NaN;
  dataUser: DataUserFarmer;

  suscription = new Subscription();

  actualByStep: number = 1;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.suscription = this.store.select(selectDataUser).subscribe((data) => {
      this.actualId = data.actualIdRegisterLots;

      switch (this.actualId) {
        case 2.1:
          this.actualByStep = 1;
          break;
        case 2.2:
          this.actualByStep = 2;
          break;
        case 2.3:
          this.actualByStep = 3;
          break;
        case 2.4:
          this.actualByStep = 4;
          break;
        case 2.5:
          this.actualByStep = 5;
          break;

        default:
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
