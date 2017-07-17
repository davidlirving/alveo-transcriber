import { Component } from '@angular/core';

import { SessionService } from './session.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  year: number;
  constructor(public sessionService: SessionService, 
              public dataService: DataService) {
    this.year = new Date().getFullYear();
  }

  title = 'app';

  currentYear(): number {
    return this.year;
  }
}