import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DataUserRegister } from 'src/app/shared/interfaces';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';
import { NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-profile-apprentice',
    templateUrl: './profile-apprentice.component.html',
    styleUrls: ['./profile-apprentice.component.css'],
    standalone: true,
    imports: [NgIf, NgStyle],
})
export class ProfileApprenticeComponent implements OnDestroy {
  @Input() actualId: number;
  dataUser?: DataUserRegister = undefined;

  suscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {
    const suscruption1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.dataUser = data.dataUserRegister;
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
