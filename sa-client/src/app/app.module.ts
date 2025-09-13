import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SermonComponent } from './components/sermon/sermon.component';
import { SermonListComponent } from './components/sermon-list/sermon-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WaveformComponent } from './components/waveform/waveform.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { RouterModule, Routes } from '@angular/router';
import { AvatarComponent } from './components/avatar/avatar.component';

const routes: Routes = [
      { path: 'sermon/:id', component: SermonComponent },
      { path: '**', component: SermonListComponent },
    ];

@NgModule({ declarations: [
        AppComponent,
        AvatarComponent,
        SermonComponent,
        SermonListComponent,
        WaveformComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        FormsModule,
        RouterModule.forRoot(routes),
        NgxSpinnerModule.forRoot({ type: 'line-scale' })], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
