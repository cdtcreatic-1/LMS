import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalButtonsComponent } from '../../../shared/global-buttons/global-buttons.component';
import { GlobalSubtitlesComponent } from '../../../shared/global-subtitles/global-subtitles.component';
import { GlobalTitlesComponent } from '../../../shared/global-titles/global-titles.component';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { selectDataShared } from 'src/app/store/selectors/global.selector';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { clearShared } from 'src/app/store/actions/shared.actions';
import { setChangeActualIdApprentice } from 'src/app/store/actions/user-menu-apprentice.action';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IonicModule } from '@ionic/angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.css'],
  standalone: true,
  imports: [
    GlobalTitlesComponent,
    GlobalSubtitlesComponent,
    GlobalButtonsComponent,
    RouterLink,
    NgIf,
    NgClass,
    IonicModule,
    MatDialogModule,
  ],
})
export class AddProfileComponent implements OnInit, OnDestroy {
  isCreatedFarmer: boolean = false;
  isCreatedBusinessman: boolean = false;
  isCreatedApprentice: boolean = false;

  baseUrl: string = '';

  suscription: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private sharedservide: SharedService,
    private matdialog: MatDialog
  ) {
    this.sharedservide.getUserRoles();
  }

  ngOnInit(): void {
    this.baseUrl = window.location.protocol + '//' + window.location.host;

    const suscription1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        data.dataRoles.forEach((rol) => {
          if (rol.id_role === 1) {
            this.isCreatedFarmer = true;
          }
          if (rol.id_role === 2) {
            this.isCreatedBusinessman = true;
          }
          if (rol.id_role == 3) {
            this.isCreatedApprentice = true;
          }
        });
      });

    this.suscription.push(suscription1);
  }

  chageProfileFarmer(id: number) {
    if (id === 1 || id === 2) {
      this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
    } else if (id === 3) {
      this.store.dispatch(setChangeActualIdApprentice({ value: 1 }));
    }
    this.matdialog.closeAll();
    this.store.dispatch(clearShared());
  }

  registerProfile() {
    this.matdialog.closeAll();
  }

  handleCloseModal() {
    this.matdialog.closeAll();
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
