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


@NgModule({
  declarations: [
    AppComponent,
    MeteoComponent,
    ClearComponent
    
  ],
  imports: [
    CommonModule,ReactiveFormsModule,HttpModule, FormsModule,BrowserModule,AppRoutingModule
  ],
  providers: [MeteoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
