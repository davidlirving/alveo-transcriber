import { OnInit, Input, Output, Component, EventEmitter } from '@angular/core';

/* WaveSurfer NPM headers */
import * as WaveSurfer from 'wavesurfer.js';
import * as Region from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import * as TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import * as MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';

import { Annotation } from '../shared/annotation';

import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

const BASE_COLOUR = 'rgba(0, 100, 0, 0.2)';
const SELECTED_COLOUR = 'rgba(0, 200, 200, 0.2)';
const SELECTED_READONLY_COLOUR = 'lightyellow';

@Component({
  selector: 'avl-ngt-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  @Output() loadingFinish = new EventEmitter();
  @Output() annotationEvent = new EventEmitter();
  @Input() annotations: Array<any>;
  @Input() clip: any;
  @Input() autoPlay = false;
  @Input() isReadOnly: boolean;

  private ready: boolean= null;

  private player: WaveSurfer= null;
  private selectedRegion: any= null;

  public audioCurrentTime: number= 0;
  public audioDuration: number= 0;

  private zoom: number= 3;
  private zoom_threshold: number= 10;


  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnDestroy(): void {
    this.destroyPlayer();
  }

  ngOnInit(): void {
    this.createPlayer();
    this.registerPlayerHandlers();

    // Do this to fix Angular redraw issues
    setInterval(() => {}, 100);
  }

  private destroyPlayer(): void {
    // We must unregister all events before firing off the destroy event.
    //  Otherwise these events (such as saving) could be triggered as wavesurfer
    //  cleans itself up.
    this.player.unAll();
    this.player.destroy();
  }

  private createPlayer(): void {
    // Initialise the player, won't be ready until it fires the 'ready' event after loading audio data
    this.player = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'black',
      progressColor: 'white',
      controls: true,
      normalize: true,
      plugins: [
        RegionsPlugin.create(),
        TimelinePlugin.create({
          container: '#timeline'
        })
      ]
    });

    // Begin loading audio data
    this.player.loadArrayBuffer(this.clip.slice(0));

    // Set up deferred initialisation
    this.player.on('ready', () => {
      this.loadRegions(this.annotations);
      this.player.zoom(this.zoom);

      if (!this.isReadOnly) {
        this.player.enableDragSelection({
            color: BASE_COLOUR,
        });
      }

      this.setPlayerHeight(80);

      this.updateAudioDuration();

      this.ready = true;
      this.loadingFinish.emit({});
    });
  }

  private registerPlayerHandlers(): void {
    // On region click, we want to go to the beginning of the region, usually to play it from the start
    this.player.on('region-click', (region: Region, e: any) => {
      e.stopPropagation(); // Stop click from being overridden by mousepos

      this.annotationEvent.emit(
        {
          'type': 'select',
          'annotation': this.getAnnotationByID(region.id)
        }
      );
    });

    // When the player finishes, playing the file, reset to the beginning
    this.player.on('finish', () => {
      this.stop();
    });

    this.player.on('audioprocess', () => {
      this.updateAudioCurrentTime();
    });

    this.player.on('region-update-end', (region: Region) => {
      if (!this.ready) {
        return;
      }

      let annotation = this.getAnnotationByID(region.id);

      // Hopefully because it's still being created
      if (annotation !== null) {
        this.annotationEvent.emit(
          {
            'type': 'update-end',
            'annotation': annotation,
            'new-start': region.start,
            'new-end': region.end
          }
        );
      }
    });

    this.player.on('region-created', (region: Region) => {
      if (this.ready) {
        if (region.id.startsWith('wavesurfer_')) {
          // Temporarily create a one-off event handler for once we finish creating a region
          this.player.once('region-update-end',
            (newRegion: Region) => {
              this.annotationEvent.emit(
                {
                  'type': 'create',
                  'id': newRegion.id,
                  'start': newRegion.start,
                  'end': newRegion.end,
                }
              );
            }
          );
        }
      }
    });

    this.player.on('region-removed', (region: Region) => {
      this.annotationEvent.emit(
        {
          'type': 'delete',
          'annotation': this.getAnnotationByID(region.id)
        }
      );
    });
  }

  public setPlayerHeight(pixels: number) {
    this.player.setHeight(pixels);
  }

  public dialogOpen(title: string, text: string): any {
    return this.dialog.open(DialogComponent, {data: {title: title, text: text}});
  }

  public play(): void {
    this.player.play();
  }

  public stop(): void {
    // Reset to beginning only if we're at the end and not a region end
    if (this.player.getCurrentTime() === this.player.getDuration()) {
      this.player.stop();
    }
  }

  public pause(): void {
    this.player.pause();
  }

  public seek(position: number): void {
    this.player.seekTo(0);
    this.player.skip(position);
  }

  public updateAudioCurrentTime(): void {
    this.audioCurrentTime = Math.floor(this.player.getCurrentTime());
  }

  private updateAudioDuration(): void {
    this.audioDuration = Math.floor(this.player.getDuration());
  }

  public getCurrentTime(): number {
    return this.audioCurrentTime;
  }

  public getAudioDuration(): number {
    return this.audioDuration;
  }

  public playing(): boolean {
    return this.player.isPlaying();
  }

  public zoomIn(): void {
    if (this.zoom < this.zoom_threshold) {
      this.zoom += 1;
    }
    this.player.zoom(this.zoom);
  }

  public zoomOut(): void {
    if (this.zoom > 0) {
      this.zoom -= 1;
    }
    this.player.zoom(this.zoom);
  }

  public replayLast(seconds: number): void {
    let position = (this.player.getCurrentTime() - seconds) / this.player.getDuration();
    if (position < 0) {
      position = 0;
    }
    this.player.seekTo(position);
  }

  public isReady(): boolean {
    return this.ready;
  }

  public loopSelectedRegion(): void {
    this.selectedRegion.playLoop();
  }

  public buildRegions(annotations: Array<Annotation>) {
    this.ready = false;
    this.annotations = annotations;
    this.destroyPlayer();
    this.createPlayer();
    this.registerPlayerHandlers();

    /*
     * Not sure what's going on, massive slowdown will occur after rebuilding.
     * Seems easiest to just remake the player.
    // this.player.unAll();
    this.player.clearRegions();
    this.loadRegions(this.annotations);
    this.registerPlayerHandlers();
     */
  }

  public loadRegions(annotations: Array<Annotation>): void {
    if (this.player.handlers !== null) { // Hackish fix to stop wrapper.null implosions
      for (const annotation of annotations) {
        this.player.addRegion({
          id: annotation.id,
          start: annotation.start,
          end: annotation.end,
          color: BASE_COLOUR,
          drag: this.isReadOnly? false: true,
          resize: this.isReadOnly? false: true,
        });
      }
    }
  }

  public gotoRegion(region: Region): void {
    this.player.seekTo(region.start / this.player.getDuration());
  }

  private findRegion(id: string): Region {
    return this.player.regions.list[id];
  }

  public countRegions(): number {
    return Object.keys(this.player.regions.list).length;
  }

  public deleteAnnotation(annotation: Annotation): void {
    const region = this.findRegion(annotation.id);
    region.remove();
  }

  // This should not be called by this component itself
  public selectAnnotation(annotation: Annotation, ignoreAutoplay: boolean): void {
    if (this.selectedRegion !== null) {
      this.selectedRegion.update({color: BASE_COLOUR});
      this.selectedRegion = null;
    }

    let region = null;
    if (annotation !== null) {
      region = this.findRegion(annotation.id);
    } else {
      this.selectedRegion = null;
    }

    if (region !== null && region !== undefined) {
      if (this.playing()) {
        this.pause();
      }

      this.gotoRegion(region);

      region.update({color: 
        this.isReadOnly ? SELECTED_READONLY_COLOUR: SELECTED_COLOUR
      });

      if (this.autoPlay && !ignoreAutoplay) {
        // Hack: Wait for smooth scroll to finish
        //  If we call region.play() too early, it will break the scroll
        //  for Chrome and possibly other browsers.
        setTimeout(()=>{
          // Make sure the region is still selected
          if (region == this.selectedRegion) {
            region.play();
          }
        }, 1500);
      }

      this.selectedRegion = region;
    }
  }

  public replayAnnotation(annotation: Annotation): void {
    const region = this.findRegion(annotation.id);
    region.play();
  }

  public getAnnotationByID(id: string): Annotation {
    for (const annotation of this.annotations) {
      if (annotation.id === id) {
        return annotation;
      }
    }
    return null;
  }
}
