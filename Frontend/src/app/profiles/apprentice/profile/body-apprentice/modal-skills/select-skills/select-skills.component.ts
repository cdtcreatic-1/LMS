import { NgClass, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { ApprenticeService } from '../../../services/apprentice.service';
import { AllSkills, QuerySkills } from '../../../interfaces';
import { Subscription } from 'rxjs';
import {
  setActualIdSkills,
  setOpenModalSkills,
  setOpenModalTypeLearning,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-select-skills',
  templateUrl: './select-skills.component.html',
  styleUrls: ['./select-skills.component.css'],
  standalone: true,
  imports: [NgFor, GlobalButtonsComponent, NgClass],
})
export class SelectSkillsComponent implements OnInit, OnDestroy {
  skills: (AllSkills & { isSelected: boolean })[] = [];
  stylearning: null | string;

  suscription = new Subscription();

  constructor(
    private appService: ApprenticeService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    const suscription1 = this.appService.getSkills().subscribe((res) => {
      if (!res) return;
      res.forEach((skill) => {
        this.skills.push({ ...skill, isSelected: false });
      });
    });

    const suscription2 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.stylearning = data.dataUserRegister?.learning_style!;
      });

    this.suscription.add(suscription1);
    this.suscription.add(suscription2);
  }

  handleSelectSkill(id: number) {
    const newDataSkills = this.skills.map((skill) => {
      if (skill.id_skill === id) {
        return { ...skill, isSelected: !skill.isSelected };
      }
      return { ...skill };
    });
    this.skills = newDataSkills;
  }

  handleClickBack() {
    this.store.dispatch(setActualIdSkills({ id: 1 }));
  }

  handleClickNext() {
    const skillsQuery: QuerySkills[] = [];

    this.skills.forEach((skill) => {
      skillsQuery.push({ id_skill: skill.id_skill });
    });

    this.store.dispatch(setOpenModalSkills({ value: false }));

    const suscription1 = this.appService
      .setSkillsUser(skillsQuery)
      .subscribe((res) => {
        if (!res) return;
        if (!this.stylearning) {
          this.store.dispatch(setOpenModalTypeLearning({ value: true }));
        }
      });

    this.suscription.add(suscription1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
