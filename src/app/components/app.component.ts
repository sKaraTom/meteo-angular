import { Component, OnInit } from '@angular/core';
import { MeteoService } from '../services/meteo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private meteoService:MeteoService) { }


  ngOnInit(): void {
      
  }

  
}
