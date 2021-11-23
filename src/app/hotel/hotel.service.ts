import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable, Subject } from 'rxjs';
import { Hotel } from './hotel.model';
import { waitForAsync } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  
  hotels: Hotel[] = [];
  hotel: any;

  hotelSub = new Subject<Hotel>();
  hotelsSub = new Subject<Hotel[]>();

  constructor(private http: HttpService) { 
    this.hotelSub.subscribe(h => this.hotel = h);
    this.hotelsSub.subscribe(h => this.hotels = h);
  }

  async setHotels(){

    this.hotels = [];
    
    let endpoint = "https://hotel-system-api.herokuapp.com/hotels";
    await this.http.get(endpoint).then(data => {
      
      let v = JSON.parse(JSON.stringify(data));
      
      v.forEach(( values: any) => {
        let h;
        if(values.numRooms <= 40 ){
          h = new Hotel(values._id, values.adminId, values.name, values.amenities, values.numRooms, values.rooms, 0, values.weekendDiff)
        }
        else{
          if(values.numRooms > 40 && values.numRooms < 100 ){
           h = new Hotel(values._id, values.adminId, values.name, values.amenities, values.numRooms, values.rooms, 1, values.weekendDiff)
          }
          else{
            h = new Hotel(values._id, values.adminId, values.name, values.amenities, values.numRooms, values.rooms, 2, values.weekendDiff)
          }
        }  
        this.hotels.push(h);
      });
    });

    this.hotelsSub.next(this.hotels);
  }

  setHotel(){
    this.hotelSub.next(this.hotel);
  }

  async getHotels(){
    return this.hotels;
  }
  
  async getHotelIDs(ids: string[]){
    this.setHotels();

    let h: any = [];
    ids.forEach(id => h.push(this.hotels.find(u => u.id === id)))
    console.log(h)
  }

  async getHotel(){
    return this.hotel;
  }

  async getHotelID(id: string){
    return { ...this.hotels.find(u => u.id == id)};
  }

  async addHotel(hotel: Hotel){

    let endpoint = "https://hotel-system-api.herokuapp.com/hotels";
  
    let body = {
      "adminId": hotel.adminId,
      "rooms": hotel.rooms,
      "amenities": hotel.amenities,
      "name": hotel.name,
      "numRooms": hotel.numRooms,
      "weekendDiff": hotel.weekendDiff
    }
    
    return await this.http.post(endpoint, body);
  }

  async updateHotel(updatedHotel: Hotel){
    
    let body = {
      "adminId": updatedHotel.adminId,
      "name": updatedHotel.name,
      "amenities": updatedHotel.amenities,
      "numRooms": updatedHotel.numRooms,
      "rooms":updatedHotel.rooms,
      "weekendDiff": updatedHotel.weekendDiff
    }

    let endpoint = "https://hotel-system-api.herokuapp.com/hotels/"+ updatedHotel.id;
    
    return await this.http.put(endpoint, body);
  }

  async deleteHotel(id: string){
    let endpoint = "https://hotel-system-api.herokuapp.com/hotels/"+ id;
    return await this.http.delete(endpoint);
  }


  onHotelChange(): Observable<any> {
    return this.hotelSub.asObservable(); 
  }

  onHotelsChange(): Observable<any> {
    return this.hotelsSub.asObservable(); 
  }
}
