import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { SummaryAddFarmComponent } from './summary-add-farm/summary-add-farm.component';
import { ReviewFamrComponent } from './review-famr/review-famr.component';
import { RegiterFarmMapComponent } from './regiter-farm-map/regiter-farm-map.component';
import { NgIf } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { IndicatorComponent } from 'src/app/register/register-farmer/indicator/indicator.component';
import { TitleComponent } from 'src/app/register/shared/title/title.component';

@Component({
  selector: 'app-add-farm',
  templateUrl: './add-farm.component.html',
  styleUrls: ['./add-farm.component.css'],
  standalone: true,
  imports: [
    IonicModule,
    IndicatorComponent,
    TitleComponent,
    NgIf,
    RegiterFarmMapComponent,
    ReviewFamrComponent,
    SummaryAddFarmComponent,
  ],
})
export class AddFarmComponent implements OnInit {
  actualId: number;
  indexInicator: number;

  constructor(private store: Store<AppState>) {}

  suscription = new Subscription();

  ngOnInit() {
    this.suscription = this.store.select(selectDataUser).subscribe((data) => {
      this.actualId = data.actualId;
      switch (this.actualId) {
        case 1.11:
          this.indexInicator = 12;
          break;
        case 1.12:
          this.indexInicator = 13;
          break;
        case 1.13:
          this.indexInicator = 14;
          break;

        default:
          break;
      }
    });
  }
}
