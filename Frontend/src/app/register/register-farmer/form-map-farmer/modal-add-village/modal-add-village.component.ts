import { NgClass } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RequestAddVillageName } from '../../interface';
import { Form1Service } from '../../services/form1.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { setNewNameVillage } from 'src/app/store/actions/user-menu.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-modal-add-village',
  templateUrl: './modal-add-village.component.html',
  styleUrls: ['./modal-add-village.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatTooltipModule],
})
export class ModalAddVillageComponent implements OnInit {
  form: FormGroup = this.fb.group({
    villageName: [''],
  });

  constructor(
    private fb: FormBuilder,
    private f1service: Form1Service,
    private matDialog: MatDialog,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    console.log({ data });
  }

  ngOnInit() {}

  validatorFields(field: string) {
    return (
      this.form.controls[field].errors && this.form.controls[field].touched
    );
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAsDirty();
      return;
    }

    this.store.dispatch(
      setNewNameVillage({ nameVillage: this.form.value['villageName'] })
    );
    
    this.matDialog.closeAll();


    // const body: RequestAddVillageName = {
    //   id_city: this.data,
    //   village_name: this.form.value['villageName'],
    // };
    // this.f1service.setAddVillageName(body);
  }
}
