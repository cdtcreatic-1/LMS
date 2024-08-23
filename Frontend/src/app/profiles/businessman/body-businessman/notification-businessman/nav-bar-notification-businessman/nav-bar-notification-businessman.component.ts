import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-nav-bar-notification-businessman',
    templateUrl: './nav-bar-notification-businessman.component.html',
    styleUrls: ['./nav-bar-notification-businessman.component.css'],
    standalone: true,
    imports: [NgClass],
})
export class NavBarNotificationBusinessmanComponent implements OnInit {
  rol$: Observable<number>;
  rol: number = 1;

  constructor(private bbesimessman: BodyBusinessmanService) {}

  ngOnInit(): void {
    this.rol$ = this.bbesimessman.getRol;
    this.rol$.subscribe((index) => (this.rol = index));
  }

  received() {
    this.bbesimessman.setTypeOffertNotificatrion(1);
  }

  sent() {
    this.bbesimessman.setTypeOffertNotificatrion(2);
  }
}
