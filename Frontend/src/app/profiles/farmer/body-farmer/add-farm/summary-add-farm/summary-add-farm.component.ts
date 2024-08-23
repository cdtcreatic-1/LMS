import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { NgIf } from '@angular/common';
import { DataRegister } from 'src/app/register/register-farmer/interface';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { BodyFarmerService } from '../../../services/body-farmer.service';

@Component({
  selector: 'app-summary-add-farm',
  templateUrl: './summary-add-farm.component.html',
  styleUrls: [
    '../../../../../register/register-farmer/form-user-created/form-user-created.component.css',
  ],
  standalone: true,
  imports: [NgIf],
})
export class SummaryAddFarmComponent {
  dataUser?: DataRegister = undefined;
  nameFarm: string;

  suscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private grservice: GlobalRegisterService,
    private bfarmer: BodyFarmerService
  ) {
    this.grservice.getDataRegisterFarm();
  }

  ngOnInit(): void {
    this.suscription = this.store.select(selectDataUser).subscribe((data) => {
      this.dataUser = data.dataRegister;
      this.nameFarm = data.dataFarm[data.dataFarm.length - 1].farm_name;
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  comeBack() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1.12 }));
  }

  next() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
    this.bfarmer.getDataProfileFarm();
  }
}
