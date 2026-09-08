import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SermonComponent } from './components/sermon/sermon.component';
import { SermonListComponent } from './components/sermon-list/sermon-list.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WaveformComponent } from './components/waveform/waveform.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { RouterModule, Routes } from '@angular/router';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ScriptureDisplayComponent } from './components/scripture-display/scripture-display.component';
import { SdgComponentsAngularModule } from '@soli-deo-gloria-software/sdg-components-angular'

const routes: Routes = [
      { path: 'sermon/:id', component: SermonComponent },
      { path: '**', component: SermonListComponent },
    ];

@NgModule({ declarations: [
        AppComponent,
        AvatarComponent,
        ScriptureDisplayComponent,
        SermonComponent,
        SermonListComponent,
        WaveformComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        FormsModule,
        RouterModule.forRoot(routes),
        NgxSpinnerModule.forRoot({ type: 'line-scale' }),
        SdgComponentsAngularModule,
        ReactiveFormsModule
    ],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi())
    ] 
})
export class AppModule { }
