import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { clearShared } from 'src/app/store/actions/shared.actions';
import { setChangeActualIdApprentice } from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-apprentice',
  templateUrl: './apprentice.component.html',
  styleUrls: ['./apprentice.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink],
})
export class ApprenticeComponent implements OnInit, OnDestroy {
  isCreated: boolean = false;

  private suscription: Subscription[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        data.dataRoles.forEach((rol) => {
          if (rol.id_role === 3) {
            this.isCreated = true;
          }
        });
      });

    this.suscription.push(suscription1);
  }

  handleChangeBuyer() {
    this.store.dispatch(clearShared());
    this.store.dispatch(setChangeActualIdApprentice({ value: 1 }));
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
