import { Component } from '@angular/core';
import { BodyFarmerService } from '../../services/body-farmer.service';

@Component({
    selector: 'app-modal-notification-farmer',
    templateUrl: './modal-notification-farmer.component.html',
    styleUrls: ['./modal-notification-farmer.component.css'],
    standalone: true,
})
export class ModalNotificationFarmerComponent {
  constructor(private bfarmer: BodyFarmerService) {}

  closeModal() {
    this.bfarmer.setModalNotification(false);
  }
}
