import { Component, Input } from '@angular/core';
// import 'animate.css';

@Component({
    selector: 'app-errors-forms',
    templateUrl: './errors-forms.component.html',
    styleUrls: ['./errors-forms.component.css'],
    standalone: true,
})
export class ErrorsFormsComponent {
  @Input() message: string = '';
  // viewError: boolean = true;

  constructor() {
    // setTimeout(() => {
    //   this.viewError = false;
    // }, 1500);
  }
}
