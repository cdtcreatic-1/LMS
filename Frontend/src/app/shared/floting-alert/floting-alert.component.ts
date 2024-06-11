import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { setShowErrorAlert } from 'src/app/store/actions/error-message.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-floting-alert',
  templateUrl: './floting-alert.component.html',
  styleUrls: ['./floting-alert.component.css'],
  standalone: true,
  imports: [NgIf, IonicModule],
})
export class FlotingAlertComponent implements OnInit {
  @Input() message: string;
  @Input() good?: boolean;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(setShowErrorAlert({ value: false }));
    }, 5000);
    // window.addEventListener('click', this.handleCloseModal);
  }

  closeErrorMessage() {
    this.store.dispatch(setShowErrorAlert({ value: false }));
  }

  handleCloseModal(event: any) {
    console.log({ event });
  }
}
