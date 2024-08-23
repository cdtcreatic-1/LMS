import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import {
  selectDataCurrentWindow,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { NgIf, NgStyle, NgClass } from '@angular/common';
import { BodyFarmerService } from 'src/app/profiles/farmer/services/body-farmer.service';

@Component({
  selector: 'app-navbar-farmer',
  templateUrl: './navbar-farmer.component.html',
  styleUrls: ['./navbar-farmer.component.css'],
  standalone: true,
  imports: [NgIf, NgStyle, NgClass],
})
export class NavbarFarmerComponent implements OnInit, OnDestroy {
  rol$: Observable<number>;
  rol: number = 1;

  currentWindowId = NaN;
  actualId = NaN;

  suscription = new Subscription();

  constructor(
    private pservice: BodyFarmerService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.rol$ = this.pservice.getRol;
    this.rol$.subscribe((index) => (this.rol = index));

    this.suscription = this.store
      .select(selectDataCurrentWindow)
      .subscribe((data) => {
        this.currentWindowId = data.dataCurrentWindow?.current_window_id!;
      });

    this.store.select(selectDataUser).subscribe((data) => {
      this.actualId = data.actualId;
    });
  }

  farmer() {
    this.pservice.setRol(1);
  }

  businessman() {
    this.pservice.setRol(2);
  }

  apprentice() {
    this.pservice.setRol(3);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
