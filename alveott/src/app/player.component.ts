import { OnInit } from '@angular/core';
import { Component, Input, HostListener } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';

/* WaveSurfer Git headers */
/* pull with git clone -b next --single-branch https://github.com/katspaugh/wavesurfer.js.git . */
/*
import WaveSurfer from 'wavesurfer.js.git';
import Region from 'wavesurfer.js.git/dist/plugin/wavesurfer.regions.min';
import RegionsPlugin from 'wavesurfer.js.git/dist/plugin/wavesurfer.regions.min';
import TimelinePlugin from 'wavesurfer.js.git/dist/plugin/wavesurfer.timeline.min';
import MinimapPlugin from 'wavesurfer.js.git/dist/plugin/wavesurfer.minimap.min';
*/

/* WaveSurfer NPM headers */ 
import WaveSurfer from 'wavesurfer.js';
import Region from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';

import { PlayerControlService } from './player-control.service';

import { Clip } from './clip';
import { Segment } from './segment';

class Cache {
  segment: Segment;
  region: Region;

  constructor(segment: Segment, region: Region) {
    this.segment = segment;
    this.region = region;
  }
}

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  player: WaveSurfer;
  _playing: boolean;
  @Input() clip: Clip;
  @Input() audioData: ArrayBuffer;
  @Input() selected: Segment;


  regionCache: Cache[] = [];

  constructor(public router: Router,
    public playCtrlService: PlayerControlService) { 
    router.events.subscribe( (event:Event) => {
      if (event instanceof NavigationStart) {
        this.player.destroy();
      }
    });
  }

  play(): void {
    this.player.play();
    this._playing = true;
  }

  stop(): void {
    this.player.stop();
    this._playing = false;
  }

  pause(): void {
    this.player.pause();
    this._playing = false;
  }

  seek(position: number): void {
    this.player.seekTo(0);
    this.player.skip(position);
  }

  getPos(): number {
    return Math.floor(this.player.getCurrentTime());
  }

  getDuration(): number {
    return Math.floor(this.player.getDuration());
  }

  addCache(segment: Segment, region: Region): void {
    this.regionCache.push(new Cache(segment, region));
  }

  loadRegions(): void {
    this.clip.segments.forEach((segment) => {
      this.player.addRegion({
        start: segment.start,
        end: segment.end,
        color: 'hsla(100, 100%, 30%, 0.1)'
      }) // Doesn't return the region object FYI

      // It's hacky: retrieves the last added region
      var region = this.player.regions.list[Object.keys(this.player.regions.list).pop()];
      this.addCache(segment, region);
    });
  }

  ngOnInit(): void {
    this._playing = false;

    this.player = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'black',
      progressColor: 'white',
      height: 200,
      controls: true,
      plugins: [
        MinimapPlugin.create(),
        RegionsPlugin.create(),
        TimelinePlugin.create({
          container: '#timeline'
        }),
      ]
    });

    this.player.loadArrayBuffer(this.audioData);

    var slider = document.querySelector('[data-action="zoom"]');
    slider.addEventListener('input', () => {
      var value = (slider as HTMLInputElement).value;
      this.player.zoom(Number(value));
    });

    this.player.on('ready', () => {
      this.loadRegions();
      this.player.zoom(30);
      (slider as HTMLInputElement).value = this.player.params.minPxPerSec;
    });

    this.player.on('region-click', (region: Region) => {
      this.playCtrlService.activeSegment = this.findSegment(region);
    });

    this.player.on('region-updated', (region: Region) => {
      this.playCtrlService.activeSegment = this.findSegment(region);
    });

    this.player.on('region-update-end', (region: Region) => {
      let segment = this.findSegment(region);
      segment.start = region.start;
      segment.end = region.end;
    });

    this.player.on('finish', () => {
      this.stop();
    });

    /*
    this.playCtrlService.on('region-change', (segment: Segment) => {
      let region = this.findRegion(segment);
      console.log(region);
      // Do something to the region
    });
     */

    // Forces Angular to update component every second
    setInterval(() => {}, 1000);
  }

  playing(): boolean {
    return this._playing;
  }

  findSegment(region: Region): Segment {
    let match = null;
    for (var cache of this.regionCache) {
      if (cache.region == region) {
        match = cache.segment;
        break;
      }
    }
    return match;
  }

  findRegion(segment: Segment): Region{
    let match = null;
    for (var cache of this.regionCache) {
      if (cache.segment == segment) {
        match = cache.region;
        break;
      }
    }
    return match;
  }
}
