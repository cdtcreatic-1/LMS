import { NgFor, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { SafePipe } from 'src/app/shared/pipes/safe-pipe-url/safe-pipe-url.pipe';
import { clearCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-videos-home',
  templateUrl: './videos-home.component.html',
  styleUrls: ['./videos-home.component.css'],
  standalone: true,
  imports: [NgStyle, NgFor, SafePipe],
})
export class VideosHomeComponent {
  videoUrl: SafeResourceUrl;

  urlVideosHome: string[] = [
    'https://www.youtube.com/embed/ji8IKhTY8Iw?si=IMLRBQYrvhuRSCg5',
    'https://www.youtube.com/embed/jMHCbVoZh3k?si=wlnpHMCrLcl5E7SG',
    'https://www.youtube.com/embed/4gqD9Yr8jkE?si=rBuZkT_gcSWROYLP',
  ];

  constructor(private store: Store<AppState>, private sanitizer: DomSanitizer) {
    this.store.dispatch(clearCurrentWindow());
    const codigoInsercion = 'cSOG5yXxR-A?si=Yf1y-zHBPTPTIxud'; // Reemplaza con tu código de inserción
    const url = `https://www.youtube.com/embed/${codigoInsercion}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
