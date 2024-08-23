import { Component } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
    selector: 'app-circle-progress-bar',
    templateUrl: './circle-progress-bar.component.html',
    styleUrls: ['./circle-progress-bar.component.css'],
    standalone: true,
    imports: [NgCircleProgressModule]
})
export class CircleProgressBarComponent {

}
