import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BodyFarmerService } from '../services/body-farmer.service';
import { Store } from '@ngrx/store';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { AppState } from 'src/app/store/app.state';
import { NgIf } from '@angular/common';
import { DataRegister } from 'src/app/register/register-farmer/interface';
import { DataProfileFarm } from 'src/app/profiles/farmer/interfaces';

@Component({
  selector: 'app-header-farmer',
  templateUrl: './header-farmer.component.html',
  styleUrls: ['./header-farmer.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class HeaderFarmerComponent implements OnInit, OnDestroy {
  actualId: number = NaN;
  bodyFarmerObs$: Observable<string>;
  bodyFarmer: string;

  dataFarmProfile?: DataProfileFarm;
  dataUserRegister?: DataRegister;

  suscription = new Subscription();

  constructor(
    private bfarmer: BodyFarmerService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.suscription = this.store.select(selectDataUser).subscribe((data) => {
      // this.dataFarmProfile = data.dataFarm;
      this.actualId = data.actualId;
      this.dataUserRegister = data.dataRegister;
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
