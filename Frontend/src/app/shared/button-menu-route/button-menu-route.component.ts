import { NgIf, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-button-menu-route',
  templateUrl: './button-menu-route.component.html',
  standalone: true,
  styleUrls: [
    '../button-menu/button-menu.component.css',
    './button-menu-route.component.css',
  ],
  imports: [NgStyle, NgIf, RouterLink, RouterLinkActive],
})
export class ButtonMenuRouteComponent implements OnInit {
  @Input() buttonName: string;
  @Input() route: string;
  @Input() iconItemPath?: string;
  @Input() isSelected?: boolean;
  @Input() onClick: (route: string) => void;

  routerLink = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerLink = `${this.route}`;
  }
}
