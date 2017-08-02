import { Component, Input } from '@angular/core';

import { AppUtilService } from './app-util.service';

//import { Segment } from './segment';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent {
  constructor(public appService: AppUtilService) { }

  @Input() clip: any;

  /*
  getSegmentsOrdered(): Array<Segment> {
    this.clip.segments.sort(function(a, b) {
      return a.start - b.start;
    });
    return this.clip.segments;
  }

  setRegion(segment: Segment): void {
    this.appService.audioPlayer.activeSegment = segment;
  }
   */
}
