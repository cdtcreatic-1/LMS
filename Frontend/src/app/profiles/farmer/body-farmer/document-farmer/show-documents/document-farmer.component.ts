import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { AppState } from 'src/app/store/app.state';
import { Subscription } from 'rxjs';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { ResponseDocumentFarmer } from 'src/app/profiles/farmer/interfaces';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-document-farmer',
  templateUrl: './document-farmer.component.html',
  styleUrls: ['./document-farmer.component.css'],
  standalone: true,
  imports: [NgClass, NgIf],
})
export class DocumentFarmerComponent implements OnInit, OnDestroy {
  dataDocuments?: ResponseDocumentFarmer = undefined;
  typeDocument: number[] = [];
  pathDocument?: string = undefined;
  isOpen: boolean = false;

  suscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(selectDataUser).subscribe((data) => {
      this.dataDocuments = data.dataDocuments;
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  addDocument() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 3.5 }));
  }

  visualizationDocument(name: string) {
    this.isOpen = true;

    if (this.isOpen) {
      const a = document.createElement('a');
      a.href = name;
      a.setAttribute('download', name);
      a.setAttribute('target', '_blank');
      a.click();
    }
    this.isOpen = false;
  }

  downloadAllDocuments() {
    this.visualizationDocument(
      this.dataDocuments?.farm_documentation_chamber_commerce!
    );
    this.visualizationDocument(this.dataDocuments?.farm_documentation_rut!);
    this.visualizationDocument(
      this.dataDocuments?.farm_documentation_id_document!
    );
  }
}
