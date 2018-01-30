import { Component, OnInit } from '@angular/core';
import { MeteoService } from '../services/meteo.service';
import { LogUpdateService } from '../services/log-update.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public version:number = 0;

  constructor(private updates:LogUpdateService) { 

    if(!localStorage.getItem('version'))
          localStorage.setItem('version',this.version.toString());

    else {
      this.version = parseInt(localStorage.getItem('version'));
      this.version += 1;
      localStorage.setItem('version',this.version.toString());
    }
  }


  ngOnInit(): void {
    console.log("ngOnInit");

  }

  // public mettreAJourApp() : void {
  //   console.log("maj appelée");
  //   this.swUpdate.activateUpdate()
  //     .then(() => {
  //       console.log('[App] activateUpdate completed')
  //       document.location.reload()
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     })
  // }


  // public ouvrirSnack() : void {
  //   this.updates.ouvrirSnackBar();
  // }
}
