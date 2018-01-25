import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Meteo } from '../domain/Meteo';

import * as urlOWM from './Url';
import { Coords } from '../domain/Coords';
import { CodePays } from '../domain/CodePays';

@Injectable()
export class MeteoService {

  constructor(private http: Http) { }

  /**
   * obtenir la météo pour une ville
   * 
   * @param zipOuVille (nom de ville ou code postal)
   * @param codePays 
   * @return meteo
   */
  public obtenirMeteoParVille(zipOuVille:any, codePays:string) {

    let concat:string = zipOuVille + "," + codePays;
    let url:string;

    if(isNaN(zipOuVille)) {
      url = `${urlOWM.URL+ "q=" + concat + urlOWM.URLFIN}`;
    }
    else {
      url = `${urlOWM.URL+ "zip=" + concat + urlOWM.URLFIN}`;
    }

    return this.http.get(url)
                    .map((res : Response) => {
                      let meteo:Meteo = this.convertirJsonAMeteo(res.json());
                      return meteo;
                    });
  }

  /**
   * obtenir la météo à partir de coordonnées gps
   * 
   * @param coords 
   * @return meteo
   */
  public obtenirMeteoParGeoloc(coords:Coords) {

    let url : string = `${urlOWM.URL+ "lat=" + coords.latitude + "&lon=" + coords.longitude + urlOWM.URLFIN}`;

    return this.http.get(url)
                    .map((res : Response) => {
                      let meteo:Meteo = this.convertirJsonAMeteo(res.json());
                      return meteo;
                    });
  }

  /**
   * obtenir la liste des pays
   * @return un json (Code, Name)
   */
  public obtenirCodesPays() {

    return this.http.get("./../assets/pays.json")
                    .map(res => res.json());
  }

  /**
   * convertir un json obtenu depuis l'API Openweathermap
   * en objet Meteo et le retourner
   * 
   * @param res (le json obtenu)
   * @return meteo : Meteo;
   */
  public convertirJsonAMeteo(res:any) : Meteo {
    
    let meteo:Meteo = new Meteo();
    
    meteo.nomVille = res.name;
    meteo.codePays = res.sys.country;
    meteo.description = res.weather[0].description;
    
    meteo.codePicto = res.weather[0].icon;
    meteo.pourcentageNuages = res.clouds.all;

    meteo.coords = new Coords();
    meteo.coords.latitude = res.coord.lat;
    meteo.coords.longitude = res.coord.lon;

    meteo.temperature = res.main.temp;
    meteo.tempMin = res.main.temp_min;
    meteo.tempMax = res.main.temp_max;

    meteo.humidite = res.main.humidity;
    meteo.vitesseVent = res.wind.speed;

    this.convertirHeuresSoleilTimezone(meteo.coords,res.sys.sunrise)
                  .subscribe(res => meteo.heureLever = res);
    
     this.convertirHeuresSoleilTimezone(meteo.coords,res.sys.sunset)
                  .subscribe(res => meteo.heureCoucher = res);
    // meteo.heureLever = res.sys.sunrise;
    // meteo.heureCoucher = res.sys.sunset;

    meteo.heureMeteo = res.dt;

    return meteo;

  }

  /**
   * convertir une date en heure locale par l'API Google
   * 
   * @param coords 
   * @param heureAConvertir 
   */
  public convertirHeuresSoleilTimezone(coords:Coords,heureAConvertir:number) {

      let url : string = `${"https://maps.googleapis.com/maps/api/timezone/json?location=" + coords.latitude + "," + coords.longitude + "&timestamp=" + heureAConvertir + "&key=AIzaSyB_pw-MKjME3zWuO2aUhmRFfg7tbwhLeNM"}`;

      // heure - 1h(à cause temps récupéré GMT+1 France, à revoir) + décalage heure été + décalage fuseau horaire
      return this.http.get(url)
                    .map(res => {
                      let heureConvertie : number = heureAConvertir -3600 + res.json().dstOffset + res.json().rawOffset; 
                      return heureConvertie;
                    });

  }


}
