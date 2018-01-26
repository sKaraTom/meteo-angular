import { Coords } from "./Coords";
import { Ville } from "./Ville";


export class Meteo {

    nomVille:string;
    codePays:string;
    ville:Ville;
    coords : Coords;

    description:string;
    codePicto:string;
    pourcentageNuages:number;

    temperature:number;
    tempMin:number;
    tempMax:number;
    humidite:number; //pourcentage
    vitesseVent:number; //vitesse m/sec

    heureLever:number;
    heureCoucher:number;

    heureMeteo:Date;

    favori:string;
}