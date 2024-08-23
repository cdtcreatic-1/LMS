import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { DataProfileFarm } from '../../interfaces';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { MatDialog } from '@angular/material/dialog';
import { BodyFarmerService } from '../../services/body-farmer.service';

@Component({
  selector: 'app-delete-products',
  templateUrl: './delete-farms.component.html',
  styleUrls: ['./delete-farms.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, GlobalButtonsComponent],
})
export class DeleteFarmsComponent implements OnInit {
  dataFarms: (DataProfileFarm & { isSelected: boolean })[] = [];
  enableButtonDelete: boolean = false;
  idWindow = signal<number>(1);

  constructor(
    private store: Store<AppState>,
    private matDialog: MatDialog,
    private bfservice: BodyFarmerService
  ) {}

  ngOnInit() {
    this.store.select(selectDataUser).subscribe((data) => {
      this.dataFarms = data.dataFarm.map((farm) => {
        return { ...farm, isSelected: false };
      });
    });
  }

  handleOnChange(item: DataProfileFarm) {
    this.dataFarms = this.dataFarms.map((farm) => {
      if (farm.id_farm === item.id_farm) {
        return { ...farm, isSelected: !farm.isSelected };
      }
      return farm;
    });
    const findDataFarm = this.dataFarms.find((item) => item.isSelected);

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

    const deleteFarms = this.dataFarms.filter((farm) => farm.isSelected);
    this.matDialog.closeAll();
    this.bfservice.deleteFarms(deleteFarms);
  }
}
