import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemsNavBarNotification } from '../../../interfaces';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setItemNavbarNotification } from 'src/app/store/actions/user-menu-apprentice.action';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html',
  styleUrls: ['./navbar-notification.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, IonicModule],
})
export class NavbarNotificationComponent implements OnInit, OnDestroy {
  itemsNavBar: ItemsNavBarNotification[] = [];

  suscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.suscription = this.store.select(selectApprentice).subscribe((data) => {
      this.itemsNavBar = data.itemsNavbarNotification;
    });
  }

  handleSelectItem(id: number) {
    this.store.dispatch(setItemNavbarNotification({ id }));
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
