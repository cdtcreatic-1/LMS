import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';

export type DataDeleteCourses = {
  nameItem: string;
  handleSubmit: () => void;
};

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css'],
  standalone: true,
  imports: [GlobalButtonsComponent],
})
export class ModalDeleteComponent implements OnInit {
  constructor(
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DataDeleteCourses
  ) {}

  ngOnInit() {}

  closeModal() {
    this.matDialog.closeAll();
  }
}
