import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-documents-businessman',
    templateUrl: './documents-businessman.component.html',
    styleUrls: ['./documents-businessman.component.css'],
    standalone: true,
    imports: [NgIf],
})
export class DocumentsBusinessmanComponent {
  pathDocument: string;

  constructor(private store: Store<AppState>) {
    this.store.select(selectBusinessProfile).subscribe((state) => {
      this.pathDocument = state.pathDocument;
    });
  }
}
