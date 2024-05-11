import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SermonComponent } from './components/sermon/sermon.component';
import { SermonListComponent } from './components/sermon-list/sermon-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WaveformComponent } from './components/waveform/waveform.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    SermonComponent,
    SermonListComponent,
    WaveformComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot([]),
    NgxSpinnerModule.forRoot({type: 'line-scale'})
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
