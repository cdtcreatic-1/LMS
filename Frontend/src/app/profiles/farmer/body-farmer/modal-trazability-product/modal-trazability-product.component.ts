import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { LotSummary } from '../../interfaces';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-trazability-product',
  templateUrl: './modal-trazability-product.component.html',
  styleUrls: ['./modal-trazability-product.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class ModalTrazabilityProductComponent implements OnInit {
  lotSummary?: LotSummary;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectDataUser).subscribe((data) => {
      this.lotSummary = data.lotSelected;
    });
  }
}
