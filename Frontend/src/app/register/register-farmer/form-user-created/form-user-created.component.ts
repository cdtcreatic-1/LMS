import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { DataRegister } from '../interface';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectDataShared,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from 'src/app/shared/constants';
import { changeCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { NgIf } from '@angular/common';
import { TitleComponent } from '../../shared/title/title.component';
import { DataUserRegister } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-form-user-created',
  templateUrl: './form-user-created.component.html',
  styleUrls: ['./form-user-created.component.css'],
  standalone: true,
  imports: [NgIf, TitleComponent, RouterLink],
})
export class FormUserCreatedComponent implements OnInit, OnDestroy {
  dataUser?: DataRegister = undefined;

  isModal: boolean = true;

  suscription = new Subscription();

  constructor(
    private grservice: GlobalRegisterService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.grservice.getDataRegisterFarm();
    this.store.dispatch(changeCurrentWindow({ value: 14 }));
  }

  ngOnInit(): void {
    const suscription1 = this.store.select(selectDataUser).subscribe((data) => {
      this.dataUser = data.dataRegister;
    });

    this.suscription.add(suscription1);
  }

  closeModal() {
    this.isModal = false;
  }

  next() {
    const userId: string = localStorage.getItem('@userId')!;
    const bodyCurrentWindowData = {
      id_user: parseInt(userId),
      current_window_id: 10,
      current_farm_number_lot: 1,
    };
    this.grservice.setCurrentWindowPOST(bodyCurrentWindowData);
    this.router.navigate([ROUTES.WELCOME_FARMER]);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
