import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clear',
  templateUrl: './clear.component.html',
  styleUrls: ['./clear.component.css']
})
export class ClearComponent implements OnInit {

  compteurLocalStorage : number;

  constructor() { }

  ngOnInit() {

    localStorage.clear();
    this.compteurLocalStorage = localStorage.length;

}

}
