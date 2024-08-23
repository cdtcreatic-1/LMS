import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataUserRegister } from 'src/app/shared/interfaces';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';
import { NgIf, UpperCasePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchProductsComponent } from '../search-products/search-products.component';
import { BodyBusinessmanService } from '../body-businessman/services/body-businessman.service';
import { setShowModalSearchProducts } from 'src/app/store/actions/user-menu-businessman.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-profile-business',
  templateUrl: './header-profile-business.component.html',
  styleUrls: ['./header-profile-business.component.css'],
  standalone: true,
  imports: [NgIf, UpperCasePipe, IonicModule, SearchProductsComponent],
})
export class HeaderProfileBusinessComponent implements OnDestroy {
  dataUser?: DataUserRegister;

  suscription: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private bbservice: BodyBusinessmanService
  ) {
    const suscription = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        if (data.dataUserRegister) this.dataUser = data.dataUserRegister;
      });
    this.suscription.push(suscription);
  }

  handleShowModalPrice() {
    this.store.dispatch(setShowModalSearchProducts({ value: true }));
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => suscription.unsubscribe());
  }
}
