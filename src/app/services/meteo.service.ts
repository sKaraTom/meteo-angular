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

    return this.http.get("./../assets/codepays.json")
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

    meteo.heureLever = res.sys.sunrise;
    meteo.heureCoucher = res.sys.sunset;

    meteo.heureMeteo = res.dt;

    meteo = this.traduireDesc(meteo);

    return meteo;

  }

  /**
   * traduire en français le champ "description"
   * obtenu depuis l'API Openweathermap
   * /!\ toutes les traductions n'ont pas été incluses, à enrichir à l'utilisation.
   * 
   * @param meteo
   * @return meteo avec traduction de la description.
   */
  private traduireDesc(meteo:Meteo) : Meteo {

    switch(meteo.description) {

      case "clear sky":{
        meteo.description = "ciel bleu";
        break;
      }
      case "few clouds":{
        meteo.description = "ciel bleu et quelques nuages";
        break;
      }
      case "scattered clouds":{
        meteo.description = "nuages épars";
        break;
      }
      case "broken clouds":{
        meteo.description = "temps nuageux avec éclaircies";
        break;
      }
      case "overcast clouds":{
        meteo.description = "ciel couvert";
        break;
      }
      case "light intensity drizzle":{
        meteo.description = "bruine légère";
        break;
      }
      case "drizzle rain":{
        meteo.description = "pluie fine";
        break;
      }
      case "rain":{
        meteo.description = "temps pluvieux";
        break;
      }
      case "shower rain":{
        meteo.description = "averses";
        break;
      }
      case "light rain":{
        meteo.description = "faible pluie";
        break;
      }
      case "moderate rain":{
        meteo.description = "pluie modérée";
        break;
      }
      case "heavy intensity rain": {
        meteo.description = "pluie intense";
        break;
      }
      case "very heavy rain" : {
        meteo.description = "pluie très intense";
        break;
      }
      case "thunderstorm":{
        meteo.description = "temps orageux";
        break;
      }
      case "snow":{
        meteo.description = "temps neigeux";
        break;
      }
      case "mist" :
      case "fog" : {
        meteo.description = "brouillard";
        break;
      }
    }

    return meteo;

}

}
