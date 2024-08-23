import { Component, OnInit } from '@angular/core';
import { PercentageComponent } from '../percentage/percentage.component';
import { ByStepsComponent } from 'src/app/shared/by-steps/by-steps.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { NgIf } from '@angular/common';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-main-page-results',
  templateUrl: './main-page-results.component.html',
  styleUrls: ['./main-page-results.component.css'],
  standalone: true,
  imports: [NgIf, PercentageComponent, TableComponent, ByStepsComponent],
})
export class MainPageResultsComponent implements OnInit {
  idEvaluation: number = 1;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectApprentice).subscribe((data) => {
      this.idEvaluation = data.idEvaluation;
    });
  }
}
