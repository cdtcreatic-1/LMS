import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ROUTES } from 'src/app/shared/constants';
import { clearShared } from 'src/app/store/actions/shared.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-modal-relogin',
  templateUrl: './modal-relogin.component.html',
  styleUrls: ['./modal-relogin.component.css'],
  standalone: true,
  imports: [IonicModule, MatDialogModule],
})
export class ModalReloginComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private matdialog: MatDialog
  ) {}

  ngOnInit() {}

  handleLogin() {
    this.matdialog.closeAll();
    this.router.navigate([ROUTES.LOGIN]);
    localStorage.clear();
    this.store.dispatch(clearShared());
  }
}
