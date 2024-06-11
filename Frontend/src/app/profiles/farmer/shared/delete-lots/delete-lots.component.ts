import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { BodyFarmerService } from '../../services/body-farmer.service';
import { ResponseTotalLots } from '../../interfaces';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { FormsModule } from '@angular/forms';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-delete-lots',
  templateUrl: './delete-lots.component.html',
  styleUrls: ['./delete-lots.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, GlobalButtonsComponent],
})
export class DeleteLotsComponent implements OnInit {
  dataLots: (ResponseTotalLots & { isSelected: boolean })[] = [];
  enableButtonDelete: boolean = false;
  idWindow = signal<number>(1);
  idFarm: number;

  constructor(
    private store: Store<AppState>,
    private matDialog: MatDialog,
    private bfservice: BodyFarmerService
  ) {}

  ngOnInit() {
    this.store.select(selectDataUser).subscribe((data) => {
      this.idFarm = data.farmSelected?.id_farm!;
      this.dataLots = data.dataLotsByFarm.map((farm) => {
        return { ...farm, isSelected: false };
      });
    });
  }

  handleOnChange(item: ResponseTotalLots) {
    this.dataLots = this.dataLots.map((lot) => {
      if (lot.id_lot === item.id_lot) {
        return { ...lot, isSelected: !lot.isSelected };
      }
      return lot;
    });
    const findDataFarm = this.dataLots.find((item) => item.isSelected);

    if (findDataFarm) {
      this.enableButtonDelete = true;
    } else {
      this.enableButtonDelete = false;
    }
  }

  handleCancel() {
    this.matDialog.closeAll();
  }

  handleDelete(id: number) {
    // console.log('Intro to click');
    if (id === 1) {
      this.idWindow.set(2);
      return;
    }

    const deleteFarms = this.dataLots.filter((lot) => lot.isSelected);
    this.matDialog.closeAll();
    this.bfservice.deleteLots(deleteFarms, this.idFarm);
  }
}
