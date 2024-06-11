import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-header-admin',
    templateUrl: './header-admin.component.html',
    styleUrls: ['./header-admin.component.css'],
    standalone: true,
    imports: [UpperCasePipe]
})
export class HeaderAdminComponent {

}
