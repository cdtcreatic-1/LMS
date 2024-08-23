import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { clearShared } from 'src/app/store/actions/shared.actions';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-businessman',
  templateUrl: './businessman.component.html',
  styleUrls: ['./businessman.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink],
})
export class BusinessmanComponent implements OnInit {
  isCreated: boolean = false;

  suscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        data.dataRoles.forEach((rol) => {
          if (rol.id_role === 2) {
            this.isCreated = true;
          }
        });
      });

    this.suscription.add(suscription1);
  }

  handleChangeBuyer() {
    this.store.dispatch(clearShared());
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
  }
}
