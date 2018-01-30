import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './components/app.component';
import { MeteoComponent } from './components/meteo/meteo.component';
import { AppRoutingModule } from './app-routing.module';
import { MeteoService } from './services/meteo.service';
import { CommonModule } from '@angular/common';
import { ClearComponent } from './components/clear/clear.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LogUpdateService } from './services/log-update.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    AppComponent,
    MeteoComponent,
    ClearComponent
    
  ],
  imports: [
    MatSnackBarModule,BrowserAnimationsModule,CommonModule,ReactiveFormsModule,HttpModule, FormsModule,BrowserModule,AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [MeteoService,LogUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
