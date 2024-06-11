import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccordionComponent } from 'src/app/shared/accordion/accordion.component';
import { DataModules, Module, Submodules } from '../../interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  setChangeIdEvaluacionFlow,
  setDataAccordionModules,
  setDataSubmoduleSelected,
  setDataSubmoduleSelectedById,
  setResetAnswersSubmodule,
  setchangeIdQuestion,
} from 'src/app/store/actions/user-menu-apprentice.action';

@Component({
  selector: 'app-main-page-menu',
  templateUrl: './main-page-menu.component.html',
  styleUrls: ['./main-page-menu.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    AccordionComponent,
    IonicModule,
    RouterLink,
    UpperCasePipe,
  ],
})
export class MainPageMenuComponent implements OnInit, OnDestroy {
  isAccordion: boolean = false;
  isSuscribe: boolean = false;
  idSubmodule: number;
  isData: boolean = false;

  moduleTitle: string = '';

  dataModules: Module[] = [];

  suscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.moduleTitle = data.dataModules?.course_title!;
        this.dataModules = data.dataModules?.Modules!;
        this.idSubmodule = data.idSubmoduleSelected;
        this.isData = true;
      });

    this.suscription.add(suscription1);

    setTimeout(() => {
      this.store.dispatch(
        setDataSubmoduleSelectedById({ id: this.idSubmodule })
      );
    }, 1000);
  }

  handleClickAccordion(idModule: number) {
    this.store.dispatch(setDataAccordionModules({ id: idModule }));
  }

  handleSubmoduleSelected(submodule: Submodules) {
    this.store.dispatch(setChangeIdEvaluacionFlow({ id: 1 }));
    this.store.dispatch(setchangeIdQuestion({ id: 1 }));
    this.store.dispatch(setResetAnswersSubmodule());
    this.store.dispatch(setDataSubmoduleSelected({ data: submodule }));
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
