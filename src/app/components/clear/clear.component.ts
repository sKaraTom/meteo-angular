import { Component, OnInit } from '@angular/core';
import { Ville } from '../../domain/Ville';

@Component({
  selector: 'app-clear',
  templateUrl: './clear.component.html',
  styleUrls: ['./clear.component.css']
})
export class ClearComponent implements OnInit {

  compteurLocalStorage : number;

  constructor() { }

  ngOnInit() {
    this.compteurLocalStorage = localStorage.length;

  }

  public resetTotal() : void {
    localStorage.clear();
    this.compteurLocalStorage = localStorage.length;
  }

  public resetGarderFavoris() : void {

    if(localStorage.getItem('fav')) {
      let favoris : string = localStorage.getItem('fav');
      localStorage.clear();
      localStorage.setItem('fav',favoris);
    } 
    else {
      localStorage.clear();
    }
    this.compteurLocalStorage = localStorage.length;
    
    

  }


}
