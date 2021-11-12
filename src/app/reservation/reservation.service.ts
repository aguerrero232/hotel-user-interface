import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { Reservation } from './reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservations: Reservation[] = [];
  reservation: any;

  reservationSub = new Subject<Reservation>();
  reservationsSub = new Subject<Reservation[]>();

  constructor(private http: HttpService) { 
    this.reservationSub.subscribe(r => this.reservation = r);
    this.reservationsSub.subscribe(r => this.reservations = r);
  }

 setReservations(){

    this.reservations = [];
    let endpoint = "https://hotel-system-api.herokuapp.com/reservations";
    
    this.http.get(endpoint).then(data => {
      let values = JSON.parse(JSON.stringify(data))
      values.forEach( ( value: any) => {
        let r = new Reservation(value._id, value._hotelID, value._userID, value.room, value.start, value.end, value.price);
        this.reservations.push(r);
      });
    });

    this.reservationsSub.next(this.reservations);
  }
  
  setReservation(){
    this.reservationSub.next(this.reservation);
  }


  getReservations(){
    return this.reservations;
  }

  getReservation(){
    return this.reservation;
  }

  getReservationID(id: string){
    return { ...this.reservations.find(u => u.id === id)};
  }

  onReservationChange(): Observable<any> {
    return this.reservationSub.asObservable(); 
  }

  onReservationsChange(): Observable<any> {
    return this.reservationsSub.asObservable(); 
  }

  async addReservation(reservation: Reservation){

    let endpoint = "https://hotel-system-api.herokuapp.com/reservations";
  
    let body = {
      "_hotelId": reservation._hotelId,
      "_userId": reservation._userId,
      "room": reservation.room,
      "start": reservation.start,
      "end": reservation.end,
      "price": reservation.price
    }

    return this.http.post(endpoint, body).then(data => {
      let value = JSON.parse(JSON.stringify(data));
      reservation.id = value._id;
      return reservation;
    }
    );
  }

  async deleteReservation(id: string){
    let endpoint = "https://hotel-system-api.herokuapp.com/reservations/"+ id;
    return this.http.delete(endpoint);
  }

  async updateReservation(updatedReservation: Reservation){

    let body = {
      "_hotelId": updatedReservation._hotelId ,
      "_userId": updatedReservation._userId,
      "room": updatedReservation.room,  
      "start": updatedReservation.start,
      "end": updatedReservation.end,
      "price": updatedReservation.price
    }

    let endpoint = "https://hotel-system-api.herokuapp.com/reservations/"+ updatedReservation.id;
    
    return this.http.put(endpoint, body );
  }

}
