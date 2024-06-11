import { NgClass, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { ItemsNavBar } from '../../../profile/interfaces';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import {
  setChangeIdEvaluacionFlow,
  setChangeIdEvaluation,
  setShowModalMenuApprentice,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-nav-bar-course',
  templateUrl: './nav-bar-course.component.html',
  styleUrls: ['./nav-bar-course.component.css'],
  standalone: true,
  imports: [NgClass, NgFor, RouterLink, IonicModule],
})
export class NavBarCourseComponent implements OnInit, OnDestroy {
  itemsNavBar: ItemsNavBar[] = [];
  idSubmodule: number = NaN;

  suscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.itemsNavBar = data.itemsNavBarEvaluation;
        this.idSubmodule = data.idSubmoduleSelected;
      });

    this.suscription.add(suscription1);

    // Set Id with route

    const route = window.location.pathname.split('/');
    const actualRoute = route[4];

    let idRoute = 1;
    switch (actualRoute) {
      case 'training-video':
        idRoute = 1;
        break;
      case 'evaluation':
        idRoute = 2;
        break;
      case 'results':
        idRoute = 3;
        break;
      default:
        break;
    }

    this.handleSelectItem(idRoute);
    // this.matDialog.open(ModalMenuComponent);
  }

  handleSelectItem(id: number) {
    this.store.dispatch(setChangeIdEvaluacionFlow({ id }));
    if (id === 3) {
      this.store.dispatch(setChangeIdEvaluation({ value: 1 }));
    }
  }

  handleClickOpenMenu() {
    this.store.dispatch(setShowModalMenuApprentice({ value: true }));
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
