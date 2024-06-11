import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataRegister } from '../interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { Subscription } from 'rxjs';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { GlobalRegisterService } from '../../services/register.service';
import { NgIf } from '@angular/common';
import { ProtectedRouteAdminLogin } from 'src/app/shared/helpers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-farmer',
  templateUrl: './welcome-farmer.component.html',
  styleUrls: ['./welcome-farmer.component.css'],
  standalone: true,
  imports: [NgIf, WelcomeComponent],
})
export class WelcomeFarmerComponent implements OnInit, OnDestroy {
  dataUser?: DataRegister;
  suscription = new Subscription();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private grserive: GlobalRegisterService
  ) {
    // ProtectedRouteAdminLogin(this.router);
    this.grserive.getDataRegisterFarm();
  }

  ngOnInit() {
    const suscription1 = this.store.select(selectDataUser).subscribe((data) => {
      this.dataUser = data.dataRegister;
    });

    this.suscription.add(suscription1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
