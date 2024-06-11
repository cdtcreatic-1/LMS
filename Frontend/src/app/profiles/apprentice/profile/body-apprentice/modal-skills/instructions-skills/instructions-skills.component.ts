import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { setActualIdSkills } from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-instructions-skills',
  templateUrl: './instructions-skills.component.html',
  styleUrls: ['./instructions-skills.component.css'],
  standalone: true,
  imports: [GlobalButtonsComponent],
})
export class InstructionsSkillsComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  handleClickNext() {
    this.store.dispatch(setActualIdSkills({ id: 2 }));
  }
}
