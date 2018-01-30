import { Component, OnInit } from '@angular/core';
import { MeteoService } from '../../services/meteo.service';
import { Meteo } from '../../domain/Meteo';
import { CodePays } from '../../domain/CodePays';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { FormGroup, FormControl } from '@angular/forms';
import { Coords } from '../../domain/Coords';
import { Ville } from '../../domain/Ville';
import { LogUpdateService } from '../../services/log-update.service';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

  public listeCodePays: CodePays[] = [];

  public form: FormGroup; // formulaire de recherche

  public meteo1 : Meteo;
  public meteo2: Meteo;

  public listeFavoris : Ville[];


  constructor(private meteoService:MeteoService) { 
    
    this.meteo1 = new Meteo();
    this.meteo1.ville = new Ville();
    this.meteo2 = new Meteo();
    this.meteo2.ville = new Ville();

    this.form = new FormGroup({
      zip : new FormControl(),
      listeFav:new FormControl(),
      listeCode : new FormControl(),
      radio : new FormControl(true)
    });

    this.listeFavoris = [];


  }

  ngOnInit() {

    // this.logUpdate.updatesAvailable();
    // console.log("ngOnInit meteo");
    // this.swUpdate.available.subscribe(event => {
    //   console.log('current version is ' + event.current.hash);
    //    console.log('available version is ' + event.available.hash);
    //  }, err => console.dir(err));
    //  this.swUpdate.activated.subscribe(event => {
    //    console.log('old version was', event.previous);
    //    console.log('new version is', event.current);
    //  }, err => console.dir(err));


    this.obtenirListePays();
    this.obtenirDernieresRecherches();

    if(localStorage.getItem('fav')) {
      this.listeFavoris = JSON.parse(localStorage.getItem('fav'));
    } 
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

    if(form.value.radio == false) {
        emplacement = "2";
    }
    else {
        emplacement = "1";
    }

    let villeAChercher : any;
    let codePays : string;
    
    if(form.value.listeFav !== null) {
      villeAChercher = form.value.listeFav.nom;
        codePays = form.value.listeFav.codePays;
    }
    else {
        villeAChercher = form.value.zip.trim();
        codePays = form.value.listeCode.Code;  
    }
        

    this.meteoService.obtenirMeteoParVille(villeAChercher,codePays)
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
    
    // let options = {
    //   enableHighAccuracy: true,
    //   timeout: 5000,
    //   maximumAge: 0
    // };

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
            });
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
    
    if(emplacement == "1") {
        this.meteo1 = meteo;
    }
    else {
        this.meteo2 = meteo;
    }

    let idt : string[] = [meteo.ville.nom,meteo.ville.codePays];
    localStorage.setItem(emplacement,JSON.stringify(idt));

    this.form.get('listeFav').setValue(null);

  }

  /**
   * modifier favori : si la ville n'est pas en favori, l'ajouter.
   * si la ville est en favori, la retirer.
   * 
   * @param ville 
   */
  public modifierFavori(meteo:Meteo) : Meteo {

    switch(meteo.favori) {
      case "favori" : {
        this.listeFavoris = this.listeFavoris.filter(v => this.filtrerFavoris(v,meteo.ville) );
        
        this.listeFavoris.sort((a,b) => {
          if (a.nom < b.nom)
             return -1;
           if (a.nom > b.nom)
             return 1;
           // a doit être égal à b
           return 0;
          })

        localStorage.setItem('fav',JSON.stringify(this.listeFavoris));
        meteo.favori = "nonFavori";
        break;
      }
      case "nonFavori" : {
        this.listeFavoris.push(meteo.ville);
        this.listeFavoris.sort((a,b) => {
          if (a.nom < b.nom)
             return -1;
           if (a.nom > b.nom)
             return 1;
           // a doit être égal à b
           return 0;
          })

        localStorage.setItem('fav',JSON.stringify(this.listeFavoris));
        meteo.favori = "favori";
        break;
      }
    }

    return meteo;

  }

  public filtrerFavoris(ville:Ville, villeAFiltrer:Ville) {
    
    if(ville.nom.toLowerCase() == villeAFiltrer.nom.toLowerCase() && (ville.codePays == villeAFiltrer.codePays)) {
        return null;
      }
    else {
        return ville;
    }

        
  }


  /**
   * obtenir la liste des pays pour le dropdown de saisie :
   * si dans localStorage --> le récupérer
   * sinon le charger depuis le fichier via le service
   * initialiser le formulaire de saisie une fois la liste obtenue.
   * 
   */
  public obtenirListePays() : void {
    
    if(!localStorage.getItem('cp')) {
        this.chargerListePaysDepuisFichier();
    }
    else {
      this.listeCodePays = JSON.parse(localStorage.getItem('cp'));

      // tester que la liste des pays est la bonne.
      if(this.listeCodePays[72].Code !== "FR")
          this.chargerListePaysDepuisFichier();
      else
          this.initialiserFormulaire();
    }
  }

  /**
   * méthode d'appel du service pour charger la liste depuis le fichier json.
   * initialisation du formulaire.  
   */
  public chargerListePaysDepuisFichier() : void {

    this.meteoService.obtenirCodesPays()
                        .subscribe(res => {this.listeCodePays = res;
                                            localStorage.setItem('cp',JSON.stringify(this.listeCodePays));
                                            this.initialiserFormulaire();
                        });

  }

  /**
   * initialiser le formulaire de saisie : France et emplacement 1 par défaut.
   * 
   */
  public initialiserFormulaire() : void {
    
    this.form = new FormGroup({
      zip : new FormControl(),
      listeFav:new FormControl(),
      listeCode : new FormControl(this.listeCodePays[72]),
      radio : new FormControl(true)
    });
  }


}
