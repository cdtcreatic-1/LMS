import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { OffersSentBusinessmanComponent } from '../offers-sent-businessman/offers-sent-businessman.component';
import { OffersReceivedBusinessmanComponent } from '../offers-received-businessman/offers-received-businessman.component';
import { NgIf } from '@angular/common';
import { NavBarNotificationBusinessmanComponent } from '../nav-bar-notification-businessman/nav-bar-notification-businessman.component';

@Component({
    selector: 'app-main-page-notification-businessman',
    templateUrl: './main-page-notification-businessman.component.html',
    styleUrls: ['./main-page-notification-businessman.component.css'],
    standalone: true,
    imports: [
        NavBarNotificationBusinessmanComponent,
        NgIf,
        OffersReceivedBusinessmanComponent,
        OffersSentBusinessmanComponent,
    ],
})
export class MainPageNotificationBusinessmanComponent implements OnInit {
  rol$: Observable<number>;
  rol: number = 1;

  constructor(private bbesimessman: BodyBusinessmanService) {}

  ngOnInit(): void {
    this.rol$ = this.bbesimessman.getRol;
    this.rol$.subscribe((index) => (this.rol = index));
  }
}
