import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'annotator-dialog', // Can't be 'dialog', conflicts
  templateUrl: './dialog.component.html',
})
export class Dialog {
  title: string;
  text: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.title = data.title;
    this.text = data.text;
  }

  getTitle(): string {
    return this.title;
  }

  getText(): string {
    return this.text;
  }
}
