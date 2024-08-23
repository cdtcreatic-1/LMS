import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataModalCllimate } from '../../interface';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';

@Component({
  selector: 'app-modal-climate-information',
  templateUrl: './modal-climate-information.component.html',
  styleUrls: ['./modal-climate-information.component.css'],
  standalone: true,
  imports: [NgIf, TitleCasePipe, IonicModule, MatTooltipModule],
})
export class ModalClimateInformationComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DataModalCllimate,
    private router: Router,
    private matDialog: MatDialog,
    private store: Store<AppState>
  ) {}

  ngOnInit() {}

  handleCloseModal() {
    this.matDialog.closeAll();
    if (!this.data.isRegister) {
      this.store.dispatch(setChangeActualIdDasboard({ actualId: 1.12 }));

      return;
    }

    //this.router.navigate(['register/farmer/history-farmer']);
  }
}
