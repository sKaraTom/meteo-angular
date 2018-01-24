import { Coords } from "./Coords";


export class Meteo {

    nomVille:string;
    codePays:string;
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
}