import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-principal-register',
  templateUrl: './principal-register.component.html',
  styleUrls: ['./principal-register.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink],
})
export class PrincipalRegisterComponent {
  constructor() {}
}
