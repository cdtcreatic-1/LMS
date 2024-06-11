import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { InstructionsSkillsComponent } from '../instructions-skills/instructions-skills.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { SelectSkillsComponent } from '../select-skills/select-skills.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main-page-modal-skills',
  templateUrl: './main-page-modal-skills.component.html',
  styleUrls: ['./main-page-modal-skills.component.css'],
  standalone: true,
  imports: [
    NgIf,
    IonicModule,
    InstructionsSkillsComponent,
    SelectSkillsComponent,
  ],
})
export class MainPageModalSkillsComponent implements OnInit {
  actualId: number = 1;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectApprentice).subscribe((data) => {
      this.actualId = data.actualIdSkills;
    });
  }
}
