import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDataCurrentWindow } from 'src/app/store/selectors/global.selector';
import { AppState } from 'src/app/store/app.state';
import { Form3dBusinessComponent } from '../form3d-business/form3d-business.component';
import { Form3cBusinessComponent } from '../form3c-business/form3c-business.component';
import { Form3bBusinessComponent } from '../form3b-business/form3b-business.component';
import { Form3aBusinessComponent } from '../form3a-business/form3a-business.component';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TitleComponent } from 'src/app/register/shared/title/title.component';

@Component({
    selector: 'app-main-page-form3-business',
    templateUrl: './main-page-form3-business.component.html',
    styleUrls: ['./main-page-form3-business.component.css'],
    standalone: true,
    imports: [
        NgIf,
        Form3aBusinessComponent,
        Form3bBusinessComponent,
        Form3cBusinessComponent,
        Form3dBusinessComponent,
        RouterOutlet,
        TitleComponent
    ],
})
export class MainPageForm3BusinessComponent implements OnInit {
  indexForm3Business?: number;

  suscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const suscruption1 = this.store
      .select(selectDataCurrentWindow)
      .subscribe((data) => {
        this.indexForm3Business = data.actualCurrentWindow;
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
