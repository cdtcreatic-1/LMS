import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-global-subtitles',
    templateUrl: './global-subtitles.component.html',
    styleUrls: ['./global-subtitles.component.css'],
    standalone: true,
})
export class GlobalSubtitlesComponent {
  @Input() nameSubTitle: string;
}
