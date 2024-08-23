import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-add-icon-message',
  templateUrl: './add-icon-message.component.html',
  styleUrls: ['./add-icon-message.component.css'],
  standalone: true,
  imports: [NgIf, IonicModule],
})
export class AddIconMessageComponent implements OnInit {
  @Input() title: string;
  @Input() nameIcon?: string;

  constructor() {}

  ngOnInit() {}
}
