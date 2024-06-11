import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { ROUTES } from 'src/app/shared/constants';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { AppState } from 'src/app/store/app.state';
import { selectDataCurrentWindow } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-modal-send-mail',
  templateUrl: './modal-send-mail.component.html',
  styleUrls: ['./modal-send-mail.component.css'],
  standalone: true,
  imports: [GlobalButtonsComponent, IonicModule],
})
export class ModalSendMailComponent {
  email: string = '';

  constructor(
    private store: Store<AppState>,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.store.select(selectDataCurrentWindow).subscribe((data) => {
      this.email = data.emailVerified;
    });
  }

  handleClosModal() {
    this.matDialog.closeAll();
    this.router.navigate([ROUTES.HOME]);
  }
}
