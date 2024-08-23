import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-title-add-lots',
  templateUrl: './title-add-lots.component.html',
  styleUrls: ['./title-add-lots.component.css'],
  standalone: true,
})
export class TitleAddLotsComponent implements OnInit {
  title: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(selectDataUser).subscribe((data) => {
      switch (data.actualIdRegisterLots) {
        case 2.1:
          this.title = 'Es importante para nosotros conocer acerca de tu café';
          break;
        case 2.2:
          this.title = 'Es importante para nosotros conocer acerca de tu café';
          break;
        case 2.3:
          this.title = 'Es importante para nosotros conocer acerca de tu café';
          break;
        case 2.4:
          this.title =
            '¿Cuentas con certificación de perfil de taza - Q Grader?';
          break;
        case 2.5:
          this.title = 'Por último, agrega una foto';
          break;
      }
    });
  }
}
