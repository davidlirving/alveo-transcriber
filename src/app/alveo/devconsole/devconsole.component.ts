import { Component, OnInit } from '@angular/core';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'dev-console',
  templateUrl: './devconsole.component.html',
  styleUrls: ['./devconsole.component.css'],
})

export class DevConsoleComponent {
  constructor(
    private authService: AuthService,
    private alveoService: AlveoService) {
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getData(): void {
    if (!this.isLoggedIn()) {
      this.authService.initiateLogin();
    } else {
      this.alveoService.getListDirectory();
    }
  }

  reset(): void {
    this.alveoService.reset();
  }

  resetStore(): void {
    this.reset();
    this.alveoService.resetStore();
  }

  storeData(): void {
    this.alveoService.storeData();
  }
}
