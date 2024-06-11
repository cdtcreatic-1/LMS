import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { BASE_URL } from 'src/app/shared/constants';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css'],
  standalone: true,
  imports: [NgFor],
})
export class HomeFooterComponent {
  docDates = BASE_URL + 'uploads/important_dates.pdf';
}
