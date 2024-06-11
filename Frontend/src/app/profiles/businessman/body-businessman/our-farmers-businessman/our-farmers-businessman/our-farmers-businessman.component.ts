import { Component, OnDestroy } from '@angular/core';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { Store } from '@ngrx/store';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { AppState } from 'src/app/store/app.state';
import { Farmers } from '../../interfaces';
import { Subscription } from 'rxjs';
import { setIdFarmSelected } from 'src/app/store/actions/user-menu-businessman.actions';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-our-farmers-businessman',
  templateUrl: './our-farmers-businessman.component.html',
  styleUrls: ['./our-farmers-businessman.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, GlobalButtonsComponent],
})
export class OurFarmersBusinessmanComponent implements OnDestroy {
  contToLeft: number = 1;
  translade: number = 0;
  interval: number = 120;

  dataFarmers: Farmers[] = [];

  presentacion = {
    'translate.%': this.translade,
    transition: '0.5s ease',
  };

  suscription = new Subscription();

  constructor(
    private bbusinessman: BodyBusinessmanService,
    private store: Store<AppState>
  ) {
    this.suscription = this.store
      .select(selectBusinessProfile)
      .subscribe((data) => {
        this.dataFarmers = data.dataFarmers;
      });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  moveToCards(id: number) {
    if (id < 0) {
      this.translade -= this.interval;
      this.presentacion['translate.%'] = this.translade;
    } else {
      this.translade += this.interval;
      this.presentacion['translate.%'] = this.translade;
    }
  }

  viewProfile(id: number) {
    this.bbusinessman.getLotsFarmerInBusinessman(id);
    this.bbusinessman.getDataFarmer(id);
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 2 }));
  }
}
