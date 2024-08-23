import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DataTrendFarmers } from 'src/app/shared/interfaces';
import { StartsComponent } from 'src/app/shared/starts/starts.component';
import { AppState } from 'src/app/store/app.state';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-trends-farmers',
  templateUrl: './trends-farmers.component.html',
  styleUrls: ['./trends-farmers.component.css'],
  standalone: true,
  imports: [NgStyle, NgFor, NgClass, StartsComponent],
})
export class TrendsFarmersComponent implements OnInit, OnDestroy {
  @Input() shadown?: boolean;
  @Input() width?: boolean;

  suscription: Subscription[] = [];

  data: {
    id: number;
    name: string;
    total_kiles: number;
    number_start: number;
    pathImage: string;
    products: {
      pathLote: string;
      color: any;
      variety: string;
      tostion: string;
      porfile_tasa: string;
      all_kiles_selle: number;
      newBackgroud: {
        background: string;
      };
    }[];
  }[] = [
    {
      id: 1,
      name: 'Andrés Felipe Tobar',
      total_kiles: 825,
      number_start: 3,
      pathImage: '../../../assets/caficultor3.webp',
      products: [
        {
          pathLote: '../../../assets/lote2.webp',
          color: '#00DE97',
          variety: 'Chocolatado',
          porfile_tasa: 'Picante similar al anís',
          tostion: 'Tueste medio',
          all_kiles_selle: 24,
          newBackgroud: {
            background: '',
          },
        },
        {
          pathLote: '../../../assets/lote3.webp',
          color: '#2F0084 ',
          variety: 'Chocolatado',
          porfile_tasa: 'Picante similar al anís',
          tostion: 'Tueste medio',
          all_kiles_selle: 24,
          newBackgroud: {
            background: '',
          },
        },
        {
          pathLote: '../../../assets/lote3.webp',
          color: '#980F88  ',
          variety: 'Chocolatado',
          porfile_tasa: 'Picante similar al anís',
          tostion: 'Tueste medio',
          all_kiles_selle: 24,
          newBackgroud: {
            background: '',
          },
        },
      ],
    },
    {
      id: 1,
      name: 'Alis Sofia',
      total_kiles: 1024,
      number_start: 5,
      pathImage: '../../../assets/caficultor4.webp',
      products: [
        {
          pathLote: '../../../assets/lote2.webp',
          color: '#00DE97',
          variety: 'Chocolatado',
          porfile_tasa: 'Picante similar al anís',
          tostion: 'Tueste medio',
          all_kiles_selle: 24,
          newBackgroud: {
            background: '',
          },
        },
        {
          pathLote: '../../../assets/lote3.webp',
          color: '#2F0084 ',
          variety: 'Chocolatado',
          porfile_tasa: 'Picante similar al anís',
          tostion: 'Tueste medio',
          all_kiles_selle: 24,
          newBackgroud: {
            background: '',
          },
        },
        {
          pathLote: '../../../assets/lote2.webp',
          color: '#980F88  ',
          variety: 'Chocolatado',
          porfile_tasa: 'Picante similar al anís',
          tostion: 'Tueste medio',
          all_kiles_selle: 24,
          newBackgroud: {
            background: '',
          },
        },
      ],
    },
  ];

  dataTrend: DataTrendFarmers[];

  private colors: string[] = ['#00DE97', '#2F0084', '#980F88'];
  private numeroAnterior = -1;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const newDataFarmer = this.data.map((item, index) => {
      const newProducts = item.products.map((product) => {
        const newBackgroud = {
          background: `linear-gradient(270deg, ${product.color} 10.23%, rgba(0, 222, 151, 0.00) 97.05%)`,
        };

        return { ...product, newBackgroud };
      });

      return {
        ...item,
        products: newProducts,
      };
    });

    this.data = newDataFarmer;

    // Data trend

    const suscription1 = this.store
      .select(selectBusinessProfile)
      .subscribe((data) => {
        const newdataTrends: DataTrendFarmers[] = [];
        data.dataTrends.forEach((dataTren) => {
          const dataLotRefactor = dataTren.lots.map((lot) => {
            const numeroAleatorio = this.generarNumeroAleatorio();
            const newBackgroud = {
              background: `linear-gradient(270deg, ${this.colors[numeroAleatorio]} 10.23%, rgba(0, 222, 151, 0.00) 97.05%)`,
            };
            return { ...lot, newBackgroud };
          });
          newdataTrends.push({ ...dataTren, lots: dataLotRefactor });
        });
        this.dataTrend = newdataTrends;
      });

    this.suscription.push(suscription1);
  }

  generarNumeroAleatorio() {
    let nuevoNumero;
    do {
      nuevoNumero = Math.floor(Math.random() * 3);
    } while (nuevoNumero === this.numeroAnterior);
    this.numeroAnterior = nuevoNumero;
    return nuevoNumero;
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
