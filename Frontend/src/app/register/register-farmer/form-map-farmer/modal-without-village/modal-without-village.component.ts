import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-without-village',
  templateUrl: './modal-without-village.component.html',
  styleUrls: ['./modal-without-village.component.css'],
  standalone: true,
  imports: [MatDialogModule],
})
export class ModalWithoutVillageComponent implements OnInit {
  constructor(private matDialog: MatDialog) {}

  ngOnInit() {}

  handleClickCloseModal() {
    this.matDialog.closeAll();
  }
}
