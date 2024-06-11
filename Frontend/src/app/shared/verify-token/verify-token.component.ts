import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { NgIf } from '@angular/common';
import { ROUTES } from '../constants';

@Component({
  selector: 'app-verify-token',
  templateUrl: './verify-token.component.html',
  styleUrls: ['./verify-token.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class VerifyTokenComponent implements OnInit {
  token: string | null;
  status: number = 1;

  constructor(
    private route: ActivatedRoute,
    private sharedservice: SharedService,
    private router: Router
  ) {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  ngOnInit(): void {
    if (this.token) {
      this.sharedservice.getVerifyToken(this.token).subscribe((res) => {
        if (!res) {
          this.status = 3;
          return;
        }

        if (typeof res === 'number') {
          this.status = 3;
          return;
        }

        if (res.valid) {
          localStorage.setItem('@access_token', res.token);
          localStorage.setItem('@userId', res.id_user.toString());
          this.status = 2;

          if (res.id_role === 1) {
            this.router.navigate(['register/farmer/locate-farm']);
          } else if (res.id_role === 2) {
            this.router.navigate(['register/businessman/preferences']);
          } else if (res.id_role === 3) {
            this.router.navigate([ROUTES.USER_APPRENTICE]);
          }

          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      });
    }
  }
}
