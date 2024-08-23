import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AgChartsAngular } from 'ag-charts-angular';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { Submodules, UserAnswer } from '../../../interfaces';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { setChangeIdEvaluation } from 'src/app/store/actions/user-menu-apprentice.action';
import { CourseEvaluationService } from '../../../services/course-evaluation.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    IonicModule,
    AgChartsAngular,
    ReactiveFormsModule,
  ],
})
export class TableComponent implements OnInit, OnDestroy {
  public options: any;
  submodulesData: Submodules[] = [];
  dataQuestionAnswers: UserAnswer[];
  percentageResult: number;

  form: FormGroup = this.fb.group({
    idSubmodule: [''],
  });

  suscription: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private testApprentice: CourseEvaluationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    let idsubmodule = this.route.snapshot.paramMap.get('idSubmodule');

    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.submodulesData = data.dataSubmodules;
      });

    this.form.get('idSubmodule')?.setValue(idsubmodule);

    if (idsubmodule) {
      this.handleSendRequest(parseInt(idsubmodule));
    }

    this.suscription.push(suscription1);
  }

  handleChangeForm() {
    const idSubmodule = this.form.value['idSubmodule'];

    if (idSubmodule) {
      this.handleSendRequest(parseInt(idSubmodule));
    }
  }

  handleSendRequest(idSubmodule: number) {
    const suscription1 = this.testApprentice
      .getQuestionsAnswersTrue(idSubmodule)
      .subscribe((res) => {
        this.dataQuestionAnswers = res.user_answers;
        this.percentageResult = res.success_rate;
        this.handleMakeGrafic(res.success_rate.toString());
      });

    this.suscription.push(suscription1);
  }

  handleMakeGrafic(percentage: string) {
    this.options = {
      data: this.getData(),
      series: [
        {
          type: 'donut',
          angleKey: 'amount',
          innerRadiusRatio: 0.7,
          fills: ['#2F0084', '#00DE97'],
          innerLabels: [
            {
              text: `${percentage}%`,
              margin: 0,
              fontSize: 22,
              color: '#2F0084',
              fontWeight: 600,
            },
          ],
          innerCircle: {
            text: 'hi',
            color: '#fff',
          },
        },
      ],
    };
  }

  getData() {
    return [
      { asset: '', amount: 100 - this.percentageResult },
      { asset: '', amount: this.percentageResult },
    ];
  }

  handleChangeId() {
    this.store.dispatch(setChangeIdEvaluation({ value: 2 }));
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
