import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-modal-congratulation-documents',
  templateUrl: './modal-congratulation-documents.component.html',
  styleUrls: ['./modal-congratulation-documents.component.css'],
  standalone: true,
  imports: [IonicModule],
})
export class ModalCongratulationDocumentsComponent implements OnInit {
  constructor(private store: Store<AppState>, private matDialgog: MatDialog) {}

  ngOnInit() {}

  handleClickCloseModal() {
    this.matDialgog.closeAll();
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
  }
}
