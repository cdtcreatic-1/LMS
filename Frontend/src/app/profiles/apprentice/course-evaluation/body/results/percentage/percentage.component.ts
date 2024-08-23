import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AgChartsAngular } from 'ag-charts-angular';
import { setChangeIdEvaluation } from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { CourseEvaluationService } from '../../../services/course-evaluation.service';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { DataGraphicsPercentage } from '../../../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.css'],
  standalone: true,
  imports: [NgStyle, NgIf, NgClass, IonicModule, AgChartsAngular],
})
export class PercentageComponent implements OnInit, OnDestroy {
  percentageRate: string;
  idCourse: number;

  suscription: Subscription[] = [];

  public options: any;
  constructor(
    private store: Store<AppState>,
    private testApprentice: CourseEvaluationService
  ) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.idCourse = data.idCourse;

        this.testApprentice
          .getPercentageCourse(data.idCourse)
          .subscribe((res) => {
            this.percentageRate = `${res.progress_rate}%`;
            this.options = {
              responsive: true,
              title: {
                text: 'Porcentaje de resultados',
              },
              data: this.getData(res.data),
              series: [
                {
                  type: 'bar',
                  xKey: 'quarter',
                  yKey: 'porcentaje',
                  yName: 'Porcentaje',
                  fill: '#2F0084',
                },
              ],
            };
          });
      });

    this.suscription.push(suscription1);
  }

  getData(data: DataGraphicsPercentage[]) {
    const res = data.map((res) => {
      return { quarter: ' ', porcentaje: res.value };
    });

    return res;
  }

  handleChangeId() {
    this.ngOnDestroy();
    this.store.dispatch(setChangeIdEvaluation({ value: 1 }));
  }

  handleDownloadCertificate() {
    this.ngOnDestroy();
    const suscription2 = this.testApprentice
      .getCertificateCourse(this.idCourse)
      .subscribe((res) => {
        if (!res) return;

        this.testApprentice.downloadCertidicate(
          res.certificate_file_path,
          this.idCourse
        );
      });

    this.suscription.push(suscription2);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
