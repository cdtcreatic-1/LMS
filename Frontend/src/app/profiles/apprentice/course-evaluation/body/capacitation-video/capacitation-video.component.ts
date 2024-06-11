import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TitleComponent } from 'src/app/register/shared/title/title.component';
import { SafePipe } from 'src/app/shared/pipes/safe-pipe-url/safe-pipe-url.pipe';
import { AppState } from 'src/app/store/app.state';
import { Submodule } from '../../../profile/interfaces';
import { selectApprentice } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-capacitation-video',
  templateUrl: './capacitation-video.component.html',
  styleUrls: ['./capacitation-video.component.css'],
  standalone: true,
  imports: [TitleComponent, SafePipe],
})
export class CapacitationVideoComponent implements OnInit {
  dataTraining?: Submodule;
  urlVideo: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectApprentice).subscribe((data) => {
      this.dataTraining = data.dataSubmoduleSelected;
      this.urlVideo = `https://www.youtube.com/embed/${data.dataSubmoduleSelected?.submodule_class_video}`;
    });
  }
}
