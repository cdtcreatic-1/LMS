import { Component } from '@angular/core';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { StartsComponent } from '../../../../../shared/starts/starts.component';
import { GlobalTitlesComponent } from '../../../../../shared/global-titles/global-titles.component';
import { GlobalSubtitlesComponent } from '../../../../../shared/global-subtitles/global-subtitles.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-offers-sent-businessman',
  templateUrl: './offers-sent-businessman.component.html',
  styleUrls: ['./offers-sent-businessman.component.css'],
  standalone: true,
  imports: [
    NgFor,
    GlobalSubtitlesComponent,
    GlobalTitlesComponent,
    StartsComponent,
    GlobalButtonsComponent,
    NgIf
  ],
})
export class OffersSentBusinessmanComponent {
  dataItems: {
    pofileTaza: string;
    coffeeVariety: string;
    asociationProgram: string;
    totalKilos: number;
    testKilos: number;
    tostion: string;
    nameLote: string;
    numberStart: number;
    accept: boolean;
  }[] = [
    {
      pofileTaza: 'Chocolatado',
      coffeeVariety: 'Catimor',
      asociationProgram: 'Nespresso AAA',
      totalKilos: 1000,
      testKilos: 50,
      tostion: 'Tueste Claro',
      nameLote: 'Lote-561HF26',
      numberStart: 5,
      accept: true,
    },
    {
      pofileTaza: 'Chocolatado',
      coffeeVariety: 'Catimor',
      asociationProgram: 'Nespresso AAA',
      totalKilos: 1000,
      testKilos: 50,
      tostion: 'Tueste Claro',
      nameLote: 'Lote-561HF26',
      numberStart: 5,
      accept: false,
    },
    {
      pofileTaza: 'Chocolatado',
      coffeeVariety: 'Catimor',
      asociationProgram: 'Nespresso AAA',
      totalKilos: 1000,
      testKilos: 50,
      tostion: 'Tueste Claro',
      nameLote: 'Lote-561HF26',
      numberStart: 5,
      accept: false,
    },
  ];
}
