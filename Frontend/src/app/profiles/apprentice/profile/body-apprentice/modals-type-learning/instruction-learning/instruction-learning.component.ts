import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { setCurrentIdTypeLearning } from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-instruction-learning',
  templateUrl: './instruction-learning.component.html',
  styleUrls: ['./instruction-learning.component.css'],
  standalone: true,
  imports: [GlobalButtonsComponent],
})
export class InstructionLearningComponent {
  constructor(private store: Store<AppState>) {}

  handleNext() {
    this.store.dispatch(setCurrentIdTypeLearning({ value: 2 }));
  }
}
