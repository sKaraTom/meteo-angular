import { Component, OnInit } from '@angular/core';
import { MeteoService } from '../../services/meteo.service';
import { Meteo } from '../../domain/Meteo';
import { CodePays } from '../../domain/CodePays';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { FormGroup, FormControl } from '@angular/forms';
import { Coords } from '../../domain/Coords';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

  public meteo1 : Meteo;
  public meteo2: Meteo;

  public listeCodePays: CodePays[] = [];

  public form: FormGroup; // formulaire de recherche

  constructor(private meteoService:MeteoService) { 
    
    this.meteo1 = new Meteo();
    this.meteo2 = new Meteo();

    this.form = new FormGroup({
      zip : new FormControl(),
      listeCode : new FormControl(),
      radio : new FormControl()
    });


  }

  ngOnInit() {

    this.obtenirListePays();
    this.obtenirDernieresRecherches();

  }

  /**
   * si des villes sont stockées dans le localStorage,
   * les récupérer et afficher la météo rechargée.
   * 
   */
  public obtenirDernieresRecherches() : void {
  
    if(localStorage.getItem('1')) {
      let idt:string[] = JSON.parse(localStorage.getItem('1'));
      this.meteoService.obtenirMeteoParVille(idt[0],idt[1])
                      .subscribe(res => this.meteo1 = res);
    }

    // si une ville 2 est déjà sauvée dans le localStorage, la récupérer.
    if(localStorage.getItem('2')) {
      let idt2:string[] = JSON.parse(localStorage.getItem('2'));
      this.meteoService.obtenirMeteoParVille(idt2[0],idt2[1])
                      .subscribe(res => this.meteo2 = res);
    }
  }

  /**
   * obtenir la météo pour une ville ou code postal saisie
   * @param form 
   */
  public obtenirMeteo(form:FormGroup) : void {

    let emplacement : string;

    if(form.value.radio ==false) {
        emplacement = "2";
    }
    else {
        emplacement = "1";
    }

    this.meteoService.obtenirMeteoParVille(form.value.zip.trim(),form.value.listeCode.Code)
                  .subscribe(res => {
                      this.sauverEtAfficherRecherche(emplacement,res);
                    },
                  err => {
                    if(err.status == 404 && isNaN(form.value.zip)) {
                      alert("aucune ville trouvée pour ce nom.")
                    }
                    else if(err.status == 404 && !isNaN(form.value.zip)) {
                      alert("aucune ville trouvée pour ce code postal.")
                    }
                    else {
                      alert("un problème est survenu, désolé.")
                    }
                  })
  }

  /**
   *  obtenir les coordonnées gps de l'utilisateur depuis navigateur (html5)
   * obtenir la météo depuis ces coordonnées, à l'emplacement spécifié (radio)
   * 
   * @param emplacement 
   */
  public obtenirMeteoParGeoloc(emplacement:boolean) : void {
    
    let emp : string;

    if(emplacement == false) {
      emp = "2";
    }
    else {
      emp = "1";
    }
    
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // obtenir la position de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
            position => {
                this.meteoService.obtenirMeteoParGeoloc(position.coords)
                                .subscribe(res => {
                                          this.sauverEtAfficherRecherche(emp,res);
                                  },
                                          err => console.dir(err))
            },
            error => {
                switch (error.code) {
                    case 1:
                        alert('Merci d\'autoriser/activer votre position GPS.');
                        break;
                    case 2:
                        alert('Position non disponible');
                        break;
                    case 3:
                        alert('Temps dépassé');
                        break;
                }
            },options);
    }
  }

  /**
   * attribuer la météo obtenue à l'emplacement spécifié (bouton radio)
   * sauver le nom de la ville et code pays dans le localStorage 
   * --> pour recharger la météo de la ville en mémoire.
   * 
   * @param emplacement (1 ou 2)
   * @param meteo 
   */
  public sauverEtAfficherRecherche(emplacement:string,meteo:Meteo) : void {

    if(emplacement == "1")
        this.meteo1 = meteo;
    else
        this.meteo2 = meteo;

    let idt : string[] = [meteo.nomVille,meteo.codePays];
    localStorage.setItem(emplacement,JSON.stringify(idt));

  }
  
  /**
   * obtenir la liste des pays pour le dropdown de saisie :
   * si dans localStorage --> le récupérer
   * sinon le charger depuis le service
   * initialiser le formulaire de saisie une fois la liste obtenue.
   * 
   */
  public obtenirListePays() : void {
    
    if(!localStorage.getItem('cp')) {
      this.meteoService.obtenirCodesPays()
                        .subscribe(res => {this.listeCodePays = res;
                                            localStorage.setItem('cp',JSON.stringify(this.listeCodePays));
                                            this.initialiserFormulaire();
                        });
    }
    else {
      this.listeCodePays = JSON.parse(localStorage.getItem('cp'));
      this.initialiserFormulaire();
    }
  }

  /**
   * initialiser le formulaire de saisie : France et emplacement 1 par défaut.
   * 
   */
  public initialiserFormulaire() : void {
    
    this.form = new FormGroup({
      zip : new FormControl(),
      listeCode : new FormControl(this.listeCodePays[75]),
      radio : new FormControl(true)
    });
  }

}
