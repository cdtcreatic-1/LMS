import { Component, Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgFor, NgStyle } from '@angular/common';
import { clearCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { AppState } from 'src/app/store/app.state';
import { StartsComponent } from '../shared/starts/starts.component';
import { HomeFooterComponent } from '../home/home-footer/home-footer.component';
import { SafePipe } from '../shared/pipes/safe-pipe-url/safe-pipe-url.pipe';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css'],
  standalone: true,
  imports: [NgFor, NgStyle, StartsComponent, HomeFooterComponent, SafePipe],
})
export class QRtestComponent {
  animal: string;
  name: string;

  data: {
    id: number;
    name: string;
    pathImage: string;
    typeCoffee: string;
    percentage: number;
    numberStart: number;
    color: string;
  }[] = [
    {
      id: 1,
      name: 'Cristian Tobar',
      pathImage: '../../../assets/caficultor3.webp',
      typeCoffee: 'Cítrico',
      percentage: 60.5,
      numberStart: 3,
      color: '#F8BFBF',
    },
    {
      id: 2,
      name: 'Luis Concha',
      pathImage: '../../../assets/caficultor5.webp',
      typeCoffee: 'Miel',
      percentage: 98,
      numberStart: 5,
      color: '#94FFF9',
    },
    {
      id: 3,
      name: 'Isabel Idrobo',
      pathImage: '../../../assets/caficultor4.webp',
      typeCoffee: 'Caramelo',
      percentage: 35,
      numberStart: 2,
      color: '#FFE88A',
    },
    {
      id: 5,
      name: 'Isabel Idrobo',
      pathImage: '../../../assets/caficultor4.webp',
      typeCoffee: 'Caramelo',
      percentage: 35,
      numberStart: 2,
      color: '#FFE88A',
    },
    {
      id: 6,
      name: 'Isabel Idrobo',
      pathImage: '../../../assets/caficultor4.webp',
      typeCoffee: 'Caramelo',
      percentage: 35,
      numberStart: 2,
      color: '#FFE88A',
    },
  ];

  videoUrl: SafeResourceUrl;

  urlVideosHome: string[] = [
    'https://www.youtube.com/embed/eDp7g0VipGM',
    'https://www.youtube.com/embed/AXewyTA9xJM',
    'https://www.youtube.com/embed/l_VqkUPtQbU',
  ];

  translade: number = 20;
  interval: number = 120;

  presentacion = {
    'translate.%': this.translade,
    transition: '0.5s ease',
  };

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private sanitizer: DomSanitizer
  ) {
    this.store.dispatch(clearCurrentWindow());
    const codigoInsercion = 'cSOG5yXxR-A?si=Yf1y-zHBPTPTIxud'; // Reemplaza con tu código de inserción
    const url = `https://www.youtube.com/embed/${codigoInsercion}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  moveToCards(id: number) {
    if (id < 0) {
      this.translade -= this.interval;
      this.presentacion['translate.%'] = this.translade;
    } else {
      this.translade += this.interval;
      this.presentacion['translate.%'] = this.translade;
    }
  }
}
