import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { AuthComponent } from './auth.component';
import { SelectorComponent } from './selector.component';
import { AnnotatorComponent } from './annotator.component';
import { SessionComponent } from './session.component';

import { SessionService } from './session.service';
import { DataService } from './data.service';

import { DurationPipe } from './duration.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SessionComponent,
    AuthComponent,
    AnnotatorComponent,
    SelectorComponent,
    DurationPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SessionService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
