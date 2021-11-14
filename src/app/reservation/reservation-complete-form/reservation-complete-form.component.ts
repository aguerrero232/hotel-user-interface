import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; 
import { Reservation } from '../reservation.model';
import { User } from '../../user/user.model';
import { Hotel } from '../../hotel/hotel.model';
import { UserService } from '../../user/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HotelService } from '../../hotel/hotel.service';
import { ReservationService } from '../reservation.service';

import {NgbDate, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-reservation-complete-form',
  templateUrl: './reservation-complete-form.component.html',
  styleUrls: ['./reservation-complete-form.component.css']
})
export class ReservationCompleteFormComponent implements OnInit {

  reservation!: Reservation;
  priceRange: Number = 50;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null=null;

  user!: User;
  userSub: Subscription;  

  hotels: Hotel[] = [];
  hotelsSub: Subscription;  
  
  hotel: any;
  hotelSub: Subscription;

  reservationSub: Subscription;

  constructor(private userService: UserService, private hotelService: HotelService, private reservationService: ReservationService, private router: Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter){
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);
    this.hotelsSub = this.hotelService.onHotelsChange().subscribe(hotel => this.hotels = hotel);
    this.hotelSub = this.hotelService.onHotelChange().subscribe(hotel => this.hotel = hotel);
    this.reservationSub = this.reservationService.onReservationChange().subscribe(reservation => this.reservation = reservation);
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if(this.user === undefined)
      this.router.navigate(["/sign-in"]);
    if(this.hotelService.hotel != undefined)
      this.hotel = this.hotelService.hotel;
    else
      this.router.navigate(["/"]);
    this.reservation = {id: "", _hotelId: "", _userId: "", room: { name: "", price: 0 }, start: "", end: "", price: 0};
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.hotelSub.unsubscribe();
    this.hotelsSub.unsubscribe();
  }

  async onSubmit(form: NgForm){
    let roomName = form.value.room;
    let f_room: any;
    let day = new Date().getDay();
    if(roomName === ""){
      alert("Room type not selected! Please select room type and doube check dates!");
      return;
    }
    // should make this into a switch to avoid the loop
    for(let i = 0; i < this.hotel.rooms.length; i++){      
      if(this.hotel.rooms[i].name == roomName){
        if(this.hotel.rooms[i].numRoomsAvailable > 0){
          //  updating count of reservatiojns allowed
          this.hotel.rooms[i].numRoomsAvailable -= 1;  
          f_room = this.hotel.rooms[i];
          break;
        }
        else{
          alert("Room is unavailable!");
          return
        }
      }
    }
    // error checking weekend diff for 0
    let wd = ( this.hotel.weekendDiff > 0) ? this.hotel.weekendDiff : 0; 
    // setting final price based on day of the week (weekend vs not)
    let final_price = ( day == 0 || day == 6 ) ? f_room.price - ( f_room.price * ( (wd > 0) ? wd/100 : 1)) :  f_room.price;
    this.reservation._hotelId = this.hotel.id;
    this.reservation._userId = this.user.id;
    this.reservation.room.name = f_room.name;
    this.reservation.room.price = f_room.price;
    this.reservation.start = (this.fromDate?.month + "/" + this.fromDate?.day + "/" + this.fromDate?.year);
    this.reservation.end =  (this.toDate == undefined ) ? this.reservation.start : (this.toDate?.month + "/" + this.toDate?.day + "/"+ this.toDate?.year );
    let daysbooked = (this.reservation.start == this.reservation.end) ? 1 : this.dayDiff(new Date(this.reservation.start), new Date(this.reservation.end));
    this.reservation.price = Number((final_price * daysbooked).toFixed(2));
    this.reservation = await this.reservationService.addReservation(this.reservation);
    this.reservationService.reservation = this.reservation;
    this.reservationService.setReservations();
    this.reservationService.setReservation();
    this.user.reservationIds.push(this.reservation.id);  
    this.userService.updateUser(this.user);    
    this.hotelService.updateHotel(this.hotel);
    this.userService.user = this.user;
    this.userService.setUsers();
    this.userService.setUser();
    localStorage.setItem('user', JSON.stringify(this.user));   // store object
    this.router.navigate(['user-information']);
  }

  dayDiff(firstDate: Date, secondDate: Date) {
    return Math.floor( Math.abs( <any>secondDate - <any> firstDate) / (1000*60*60*24));
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)){
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate){
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate){
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null{
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}