import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BASE_URL_FRONTEND } from 'src/app/shared/constants';
import { DownloadQrComponent } from 'src/app/shared/download-qr/download-qr.component';
import { setDataQr } from 'src/app/store/actions/shared.actions';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { DataTableStateSell } from 'src/app/profiles/farmer/interfaces';
import { NgFor, NgClass, NgIf, TitleCasePipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-state-sent-businessman',
    templateUrl: './state-sent-businessman.component.html',
    styleUrls: ['./state-sent-businessman.component.css'],
    standalone: true,
    imports: [
        NgFor,
        NgClass,
        NgIf,
        TitleCasePipe,
        DecimalPipe
    ],
})
export class StateSentBusinessmanComponent {
  isModal: boolean = false;

  dataTableStateSell: DataTableStateSell[] = [];

  constructor(private matDialog: MatDialog, private store: Store<AppState>) {
    this.store.select(selectDataUser).subscribe((data) => {
      this.dataTableStateSell = data.dataTableStateSell;
    });
  }

  changeModal(state: boolean) {
    this.isModal = state;
  }

  openModalQr(idPurchase: number) {
    const link = `${BASE_URL_FRONTEND}traceability/${idPurchase}`;
    this.store.dispatch(setDataQr({ url: link }));
    this.matDialog.open(DownloadQrComponent);
  }
}
