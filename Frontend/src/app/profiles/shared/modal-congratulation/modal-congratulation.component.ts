import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-modal-congratulation',
  templateUrl: './modal-congratulation.component.html',
  styleUrls: ['./modal-congratulation.component.css'],
  standalone: true,
  imports: [IonicModule, MatDialogModule],
})
export class ModalCongratulationComponent implements OnInit {
  constructor(private router: Router, private matDialog: MatDialog) {}

  ngOnInit() {}

  handleClickLogin() {
    this.router.navigate(['login']);
    this.matDialog.closeAll();
  }
}
