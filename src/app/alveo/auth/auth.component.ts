import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})

export class AuthComponent implements OnInit, OnDestroy {
  param_sub: any;
  @Input() firstRun: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService) { }

  isFirstRun(): boolean {
    return this.firstRun;
  }

  actionLogin(): void {
    this.authService.initiateLogin();
  }

  ngOnInit() {
    this.param_sub = this.route.queryParams.subscribe(params => {
      if (params['code'] != undefined) {
        this.authService.callback(params['code']);
        this.authService.login(() => {
          this.router.navigate(['./itemlists']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.param_sub.unsubscribe();
  }
}
