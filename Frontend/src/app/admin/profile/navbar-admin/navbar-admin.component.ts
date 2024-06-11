import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { ITEM_MENU_ADMIN, ROUTES_ADMIN } from '../../routes';
import { NgFor } from '@angular/common';
import { ButtonMenuRouteComponent } from 'src/app/shared/button-menu-route/button-menu-route.component';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css'],
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, ButtonMenuRouteComponent],
})
export class NavbarAdminComponent implements OnInit, OnDestroy {
  routes: string[] = ROUTES_ADMIN;
  itemMenu: string[] = ITEM_MENU_ADMIN;
  idRoute: string = '';

  suscription: Subscription = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id_route');
    this.idRoute = id ? id : '';
  }

  ngOnInit(): void {
    // const suscription1 = this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe((event: any) => {
    //     const url = event['url'].split('/');
    //     const ultimaPosicion = url[url.length - 1];
    //     this.idRoute = ultimaPosicion;
    //   });
    // this.suscription.add(suscription1);
  }

  handleClickButtons(route: string) {
    if (route === 'logout') {
      this.router.navigate(['admin']);
      localStorage.clear();
      return;
    }
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
