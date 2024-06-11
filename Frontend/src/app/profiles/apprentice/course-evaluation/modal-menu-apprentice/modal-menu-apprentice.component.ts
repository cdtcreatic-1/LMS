import { Component, OnInit } from '@angular/core';
import { MainPageMenuApprenticeComponent } from '../../profile/menu-aprendice/main-page-menu-apprentice/main-page-menu-apprentice.component';
import { setShowModalMenuApprentice } from 'src/app/store/actions/user-menu-apprentice.action';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-modal-menu-apprentice',
  templateUrl: './modal-menu-apprentice.component.html',
  styleUrls: ['./modal-menu-apprentice.component.css'],
  standalone: true,
  imports: [MainPageMenuApprenticeComponent],
})
export class ModalMenuApprenticeComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  handleClickOpenMenu() {
    this.store.dispatch(setShowModalMenuApprentice({ value: false }));
  }
}
