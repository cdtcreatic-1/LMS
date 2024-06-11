import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddIconMessageComponent } from '../add-icon-message/add-icon-message.component';

@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css'],
  standalone: true,
  imports: [IonicModule, AddIconMessageComponent],
})
export class AddDocumentsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
