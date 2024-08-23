import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TraceabilityService } from '../service/traceability.service';
import { DataTraceability } from '../interfaces';
import { IonicModule } from '@ionic/angular';
import { NgIf, DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-main-page-traceability',
    templateUrl: './main-page-traceability.component.html',
    styleUrls: ['./main-page-traceability.component.css'],
    standalone: true,
    imports: [
        NgIf,
        IonicModule,
        DecimalPipe,
        DatePipe,
    ],
})
export class MainPageTraceabilityComponent implements OnInit {
  idPurchase: string | null;
  dataTraceability: DataTraceability;

  constructor(
    private route: ActivatedRoute,
    private tracebilityService: TraceabilityService
  ) {
    this.idPurchase = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.idPurchase) {
      this.tracebilityService
        .getDataFarmer(this.idPurchase)
        .subscribe((response) => {
          if (!response) return;
          this.dataTraceability = response;
        });
    }
  }

  test() {}
}
