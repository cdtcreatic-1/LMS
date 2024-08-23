import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { MatDialog } from '@angular/material/dialog';
import { DownloadQrComponent } from 'src/app/shared/download-qr/download-qr.component';
import { setDataQr } from 'src/app/store/actions/shared.actions';
import { BASE_URL_FRONTEND } from 'src/app/shared/constants';
import { NgIf, NgFor, NgClass, TitleCasePipe } from '@angular/common';
import { DataTableStateSell } from 'src/app/profiles/farmer/interfaces';

@Component({
  selector: 'app-history-sales',
  templateUrl: './history-sales.component.html',
  styleUrls: ['./history-sales.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, TitleCasePipe],
})
export class HistorySalesComponent implements OnInit {
  dataTableStateSell: DataTableStateSell[] = [];

  constructor(private store: Store<AppState>, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.store.select(selectDataUser).subscribe((data) => {
      this.dataTableStateSell = data.dataTableStateSell;
    });
  }

  openModalQr(idPurchase: number) {
    const link = `${BASE_URL_FRONTEND}traceability/${idPurchase}`;
    this.store.dispatch(setDataQr({ url: link }));
    this.matDialog.open(DownloadQrComponent);
  }
}
