import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectDataShared,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import {
  setChangeActualIdDasboard,
  setFarmSelected,
} from 'src/app/store/actions/user-menu.actions';
import { BodyFarmerService } from '../../services/body-farmer.service';
import { NgIf, NgFor, NgClass, UpperCasePipe } from '@angular/common';
import { DataProfileFarm } from 'src/app/profiles/farmer/interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteFarmsComponent } from '../../shared/delete-farms/delete-farms.component';
import { IonicModule } from '@ionic/angular';
import { ModalCompletDocumentsComponent } from '../modal-complet-documents/modal-complet-documents.component';
import { DataUserRegister } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-details-farmer',
  templateUrl: './details-farmer.component.html',
  styleUrls: ['./details-farmer.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DeleteFarmsComponent,
    MatDialogModule,
    IonicModule,
    UpperCasePipe,
  ],
})
export class DetailsFarmerComponent implements OnInit, OnDestroy {
  dataUserFarmer?: DataProfileFarm[];
  dataUser?: DataUserRegister;

  private suscription: Subscription[] = [];

  constructor(
    private store: Store<any>,
    private bfservice: BodyFarmerService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    const suscription1 = this.store.select(selectDataUser).subscribe((data) => {
      this.dataUserFarmer = data.dataFarm;
    });

    const suscription2 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.dataUser = data.dataUserRegister;
      });

    this.suscription.push(suscription1);
    this.suscription.push(suscription2);
  }

  onClickAddFarm() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1.11 }));
  }

  onClickDeleteFarm() {
    this.matDialog.open(DeleteFarmsComponent);
  }

  handleChange(event: any, farm: DataProfileFarm) {
    if (!this.dataUser?.hasDocumentation) {
      this.matDialog.open(ModalCompletDocumentsComponent);
      return;
    }

    const id: number = parseInt(event.target.value);

    this.store.dispatch(setFarmSelected({ farm }));

    this.bfservice.getAllLotsByFarm(farm.id_farm);

    if (id === 1) {
      this.store.dispatch(setChangeActualIdDasboard({ actualId: 2 }));
    } else {
      this.store.dispatch(setChangeActualIdDasboard({ actualId: 2.1 }));
    }
  }

  ngOnDestroy() {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
