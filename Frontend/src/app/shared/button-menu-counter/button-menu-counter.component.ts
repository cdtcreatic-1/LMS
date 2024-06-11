import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  setAccordionApprentice,
  setChangeActualIdApprentice,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button-menu-counter',
  templateUrl: './button-menu-counter.component.html',
  styleUrls: ['./button-menu-counter.component.css'],
  standalone: true,
  imports: [NgIf, IonicModule],
})
export class ButtonMenuCounterComponent {
  @Input() idRole: number;
  @Input() buttonName: string;
  @Input() amountNotification: number;
  @Input() iconItemPath: string;
  @Input() idItemMenu: number;
  @Input() ionIcon?: string;

  isAccordion: boolean;

  constructor(private store: Store<AppState>) {
    this.store.select(selectApprentice).subscribe((data) => {
      this.isAccordion = data.isAccordion;
    });
  }

  setNotifiaction() {
    if (this.idRole === 1 || this.idRole === 2) {
      this.store.dispatch(
        setChangeActualIdDasboard({ actualId: this.idItemMenu })
      );
    } else if (this.idRole === 3) {
      this.store.dispatch(
        setChangeActualIdApprentice({ value: this.idItemMenu })
      );

      if (this.idItemMenu >= 4) {
        console.log('Entra');
        this.store.dispatch(setAccordionApprentice({ value: false }));
      }
    }
  }
}
