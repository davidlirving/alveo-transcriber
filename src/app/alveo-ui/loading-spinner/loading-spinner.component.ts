import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() spinnerSize = 'large';
  @Input() inline = false;

  constructor() { }

  public usePageFill(): boolean {
    if (this.spinnerSize === 'large') {
      return true;
    }
    return false;
  }

  public getSpinnerDiameter(): number {
    switch (this.spinnerSize) {
      case 'tiny': {
        return 20;
      }
      case 'small': {
        return 40;
      }
      case 'medium': {
        return 80;
      }
      case 'large': {
        return 140;
      }
    }
  }
}
