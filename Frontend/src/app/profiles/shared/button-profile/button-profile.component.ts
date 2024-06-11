import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { MenuLateralService } from '../../service/menu-lateral.service';

@Component({
  selector: 'app-button-profile',
  templateUrl: './button-profile.component.html',
  styleUrls: ['./button-profile.component.css'],
  standalone: true,
})
export class ButtonProfileComponent implements OnInit {
  isAccordionObs$: Observable<boolean>;
  isAccordion: boolean;

  constructor(
    private mlateral: MenuLateralService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.isAccordionObs$ = this.mlateral.getisAccordion;
    this.isAccordionObs$.subscribe((index) => (this.isAccordion = index));
    this;
  }

  setAccordonFarmerProfile() {
    this.mlateral.setisAcordion(!this.isAccordion);
  }

  setProfile(id: number) {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
    this.mlateral.setisAcordion(false);
  }
}
