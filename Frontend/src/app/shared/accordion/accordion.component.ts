import { Component, Input, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.css'],
    standalone: true,
    imports: [
        NgIf,
        IonicModule,
        NgFor,
    ],
})
export class AccordionComponent {
  @Input() title: string;
  @Input() subtitle?: string;
  @Input() content?: string;
  @Input() fontSizeTitle?: string;
  @Input() fontSubSizeTitle?: string;
  @Input() data?: string[];

  public isAccordion = signal<boolean>(true);

  handleChageAccordion() {
    this.isAccordion.update((value) => !value);
  }
}
