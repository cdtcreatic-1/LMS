import { Component, OnInit } from '@angular/core';
import { BodyFarmerService } from '../../services/body-farmer.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { BodyBusinessmanService } from 'src/app/profiles/businessman/body-businessman/services/body-businessman.service';
import { NgIf, NgFor } from '@angular/common';
import { ResponseNotification } from 'src/app/profiles/farmer/interfaces';

@Component({
  selector: 'app-notification-farmer',
  templateUrl: './notification-farmer.component.html',
  styleUrls: ['./notification-farmer.component.css'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class NotificationFarmerComponent implements OnInit {
  dataNotification: ResponseNotification[] = [];

  constructor(
    private bfarmer: BodyFarmerService,
    private store: Store<AppState>,
    private bbservice: BodyBusinessmanService
  ) {}

  ngOnInit(): void {
    this.store.select(selectDataUser).subscribe((data) => {
      this.dataNotification = data.dataNotificationFarmer;
    });
  }

  cancel(idPurchase: number) {
    this.bbservice.setChangeStatusPurchase(idPurchase, 3).subscribe((res) => {
      if (!res) return;
      this.bfarmer.getNotification();
      this.bfarmer.getTableStateSell(1);
    });
  }

  accept(idPurchase: number) {
    this.bbservice.setChangeStatusPurchase(idPurchase, 4).subscribe((res) => {
      if (!res) return;
      this.bfarmer.getNotification();
      this.bfarmer.getTableStateSell(1);
    });
    this.bfarmer.getNotification();
  }
}
