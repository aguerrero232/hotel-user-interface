import { Injectable } from '@angular/core';
import { Hotel } from './hotel.model';

@Injectable({
  providedIn: 'root'
})
export class ParseHotelsService {
  
  parsedHotels: Hotel[] = [];

  constructor() {}

  getParsedHotels(){
    return this.parsedHotels;
  }

  setParsedHotels(hotels: Hotel[]){
    this.parsedHotels = hotels;
  }

}
