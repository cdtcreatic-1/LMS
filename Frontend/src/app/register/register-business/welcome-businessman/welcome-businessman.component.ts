import { Component, OnInit } from '@angular/core';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';
import { ResponseRegisterBusineeman } from '../../register-farmer/interface';
import { NgIf } from '@angular/common';
import { RegisterBusinessmanService } from '../services/register-businessman.service';
import { ProtectedRouteAdminLogin } from 'src/app/shared/helpers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-businessman',
  templateUrl: './welcome-businessman.component.html',
  styleUrls: ['./welcome-businessman.component.css'],
  standalone: true,
  imports: [NgIf, WelcomeComponent],
})
export class WelcomeBusinessmanComponent implements OnInit {
  dataUser?: ResponseRegisterBusineeman = undefined;

  suscription = new Subscription();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private registerBusinessman: RegisterBusinessmanService
  ) {
    // ProtectedRouteAdminLogin(this.router);
    this.registerBusinessman.getDataRegisterBusinessman();
  }

  ngOnInit() {
    const suscruption1 = this.store.select(selectDataUser).subscribe((data) => {
      this.dataUser = data.dataRegisterBusinessman;
    });

    this.suscription.add(suscruption1);
  }
}
