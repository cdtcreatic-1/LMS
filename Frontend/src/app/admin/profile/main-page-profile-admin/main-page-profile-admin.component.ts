import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { Router, RouterOutlet } from '@angular/router';
import { ProtectedRouteAdminLogin } from 'src/app/shared/helpers';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { NgClass, NgIf } from '@angular/common';
import { FlotingAlertComponent } from 'src/app/shared/floting-alert/floting-alert.component';

@Component({
  selector: 'app-main-page-profile-admin',
  templateUrl: './main-page-profile-admin.component.html',
  styleUrls: ['./main-page-profile-admin.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterOutlet,
    NavbarAdminComponent,
    HeaderAdminComponent,
    LoadingComponent,
    FlotingAlertComponent,
  ],
})
export class MainPageProfileAdminComponent implements OnInit {
  isLoading: boolean = false;
  isErrorAlert: boolean = false;
  message: string = '';

  suscription = new Subscription();

  constructor(private router: Router, private store: Store<AppState>) {
    // ProtectedRouteAdminLogin(this.router);
    // this.router.navigate(['/admin/profile/users']);
  }

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.isErrorAlert = data.isError;
        this.message = data.message;
      });

    const suscription2 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    this.suscription.add(suscription1);
    this.suscription.add(suscription2);
  }
}
