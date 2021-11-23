import { Reservation } from './../../reservation/reservation.model';
import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import {UserService} from '../user.service';
import { Subscription } from 'rxjs';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { HotelService } from 'src/app/hotel/hotel.service';
import { ReservationService } from 'src/app/reservation/reservation.service';
import { Hotel } from 'src/app/hotel/hotel.model';
import { Router } from '@angular/router';
import { HashService } from 'src/app/hash.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {
 
  reservation!: Reservation;
  priceRange: Number = 50;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null=null;

  user: any;
  users: User[] = [];
  
  selected_res: any; 
  reservations: Reservation[] = [];

  user_reservations = new Array(); 
  
  hotels: Hotel[] = []

  userSub: Subscription;
  usersSub: Subscription;
  reservationsSub: Subscription;

  constructor(private userService: UserService, private hotelService: HotelService,private reservationService: ReservationService, private hashService: HashService, private modalService: NgbModal, private router: Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter){
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);   
    this.usersSub = this.userService.onUsersChange().subscribe( users => this.users = users);    
    this.reservationsSub = this.reservationService.onReservationsChange().subscribe(reservations => this.reservations = reservations );
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
  }

  ngOnInit(){
    this.reservationService.setReservations();
    this.reservations =  this.reservationService.reservations;
    this.hotels = this.hotelService.hotels;
    this.user = this.userService.user;
    this.users = this.userService.users;
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.usersSub.unsubscribe();
    this.reservationsSub.unsubscribe();
  }
  
  openUpdateEmail(content: any){ this.modalService.open(content) }

  openResetPassword(content1: any) { this.modalService.open(content1) }
  
  openupdateToAdmin(content2: any){ this.modalService.open(content2) }

  openUpdateRes(content3: any, res_data: any){ 
    this.selected_res = res_data;
    this.modalService.open(content3) 
  }

  getReservations(){
    
    this.user_reservations = new Array();    
    let user_res_hotel_filt: { res: Reservation; hotel: Hotel; }[] = [];
    let filtered: { res: Reservation; hotel: Hotel; }[] = [];    
    let user_reservations_filt = this.reservations.filter( r => r._userId == this.user.id);
    user_reservations_filt.forEach( r => {
      let h = this.hotels.find(f => f.id == r._hotelId);
      if(h != undefined)
        user_res_hotel_filt.push({res: r, hotel: h});
    });
    
    user_res_hotel_filt.forEach( x => {
      if(!filtered.some(y => JSON.stringify(y) === JSON.stringify(x))){
        filtered.push(x)
      }
    });

    this.user_reservations = filtered;
  }

  deleteReservation(){
    
    this.modalService.dismissAll();

    this.reservationService.deleteReservation(this.selected_res.res.id);

    // updating the number of the hotel rooms available
    let c_hotel = this.selected_res.hotel;    
    
    let roomType = 0;
    
    switch (this.selected_res.res.room.name){
      case 'Standard':
        roomType = 0;
        break;
      case 'Queen':
        roomType = 1;
        break;
      case 'King':
        roomType = 2;
        break;
      default:
        roomType = 0;
        break;
    }

    c_hotel.rooms[roomType].numRoomsAvailable += 1;
    
    this.hotelService.updateHotel(c_hotel);
    this.hotelService.setHotels(); 
    
    this.reservationService.setReservations();
    
    this.getReservations();

    this.router.navigateByUrl('/').then(() => {
      this.router.navigate(['user-information']);
    });

  }

  updateToAdmin(form: NgForm) {
    this.users = this.userService.getUsers();
    let htl: Hotel[] = [];
    let res: Reservation[] = [];
    let password = form.value.password;
    let email = form.value.email;
    let u_user = this.users.find(u => u.email === email);

    // async causeing dups so filtering for uniques
    this.reservations.forEach( x => {
      if(!res.some(y => JSON.stringify(y) === JSON.stringify(x))){
        res.push(x)
      }
    });
        
    this.hotels.forEach( x => {
      if(!htl.some(y => JSON.stringify(y) === JSON.stringify(x))){
        htl.push(x)
      }
    });

    if (u_user){
      if (this.hashService.get(u_user.password) === password) {
        u_user.isAdmin = 1;
    
        let user_reservations_filt = this.reservations.filter( r => r._userId == this.user.id);
        user_reservations_filt.forEach( r => {
        let h = htl.find(f => f.id == r._hotelId);
        
        if(h != undefined){
          switch (r.room.name) {
              case 'Standard':
                h.rooms[0].numRoomsAvailable += 1;
              break;

              case 'Queen':
                h.rooms[1].numRoomsAvailable += 1;
              break;

              case 'King':
                h.rooms[2].numRoomsAvailable += 1;
              break;

              default:
                console.log("Invalid hotel room");
              break;
            }
          this.hotelService.updateHotel(h);
        }
      });
        this.hotelService.setHotels();
        this.userService.updateUser(u_user);
        this.userService.setUsers();
        this.modalService.dismissAll();
        return;
      }
      else {
        alert("Incorrect password!");
        return;
      }
    }
    else {
      alert("Couldnt find " + email + "!");
      return;
    }
  }

  updatePassword(form: NgForm){    
    this.users = this.userService.getUsers();
    
    let password = form.value.password;
    let confirmPassword = form.value.confirmPassword;
    let newPassword = form.value.newPassword;
    let email = form.value.email;
    
    if(this.user.email === email){
      if( this.hashService.get(this.user.password) === password){
        if(newPassword === confirmPassword){
          let new_hashed_p = this.hashService.set(newPassword);
          this.user.password = new_hashed_p;
          this.userService.user = this.user;
          this.userService.updateUser(this.user);
          this.userService.setUser();
          this.modalService.dismissAll();
          localStorage.setItem('user', JSON.stringify(this.user));   // store object
          return;          
        }else{
          alert("New Passowrd does not match!");
          return;  
        }
      }
      else{
        alert("Incorrect Password!");
        return;
      }
    }
    else{
      alert("Email not found!");
      return;
    }
  }
 
  updateEmail(form: NgForm){
    
    this.users = this.userService.getUsers();
    
    let password = form.value.password;
    let email = form.value.email;
    let newEmail = form.value.newEmail;
    
    if(this.user.email === email){
      if(this.hashService.get(this.user.password) === password){
        this.user.email = newEmail;
        this.userService.user = this.user;
        this.userService.updateUser(this.user);
        this.userService.setUser();
        localStorage.setItem('user', JSON.stringify(this.user));   // store object
        this.modalService.dismissAll();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['user-information']);
        }); 
        return;          
      }
      else{
        alert("Incorrect Password!");
         return;
      } 
    }
    else{
      alert("Email not found!");
      return;
    }

  }

  updateReservation(form: NgForm){
    
    let c_hotel = this.selected_res.hotel;
    let c_res = this.selected_res.res;

    let f_room: any;
    let roomName = form.value.room;
    
    if(roomName === ""){
      alert("Room type not selected! Please select room type and doube check dates!");
      return;
    }
    if(c_res.roomName != roomName){
      
      for(let i = 0; i < c_hotel.rooms.length; i++){      
        if(c_hotel.rooms[i].name == roomName){
          c_hotel.rooms[i].numRoomsAvailable -= 1;  
            f_room = c_hotel.rooms[i];
        }
        else if(c_res.room.name == c_hotel.rooms[i].name){
          // updating count of the room the user changed from +1 
          c_hotel.rooms[i].numRoomsAvailable += 1;  
        }
      }

      this.hotelService.updateHotel(c_hotel);
      this.hotelService.setHotels();
    }
    else{
      let roomType = 0;
      switch (c_res.room.name){
        case 'Standard':
          roomType = 0;
          break;
        
        case 'Queen':
          roomType = 1;
          break;
        
        case 'King':
          roomType = 2;
          break;
        
        default:
          roomType = 0;
          break;
      }
      f_room = c_hotel.rooms[roomType];
    }
    
    // error checking weekend diff for 0
    let wd = ( c_hotel.weekendDiff > 0) ? c_hotel.weekendDiff : 0; 
    
    c_res.room.name = f_room.name;
    c_res.room.price = f_room.price;

    c_res.start = (this.fromDate?.month + "/" + this.fromDate?.day + "/" + this.fromDate?.year);
    
    c_res.end =  (this.toDate == undefined ) ? c_res.start : (this.toDate?.month + "/" + this.toDate?.day + "/"+ this.toDate?.year );

    let daysbooked = (c_res.start == c_res.end) ? 1 : this.dayDiff(new Date(c_res.start), new Date(c_res.end));
    
    let weekend_count = this.weekendCount(new Date(c_res.start), new Date(c_res.end), daysbooked);
    
    let final_price =  (f_room.price * (daysbooked - weekend_count) + ( f_room.price * weekend_count + ( f_room.price * weekend_count * ((wd > 0) ? wd/100 : 1)))).toFixed(2);

    c_res.price = Number(final_price);

    this.reservationService.updateReservation(c_res);
    
    this.reservationService.setReservations();
    
    this.modalService.dismissAll();

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['user-information']);
    });

  }

  dayDiff(firstDate: Date, secondDate: Date) {
    return Math.floor( Math.abs( <any>secondDate - <any> firstDate) / (1000*60*60*24)) + 1;
  }

  weekendCount(firstDate: Date, secondDate: Date, numDays: number){
    let weekendCount = 0;
    let nextDate = firstDate;
    for(let i = 0; i < numDays; i++){
      let day = nextDate.getDay();
      if( day == 0 || day == 6 ){
        weekendCount += 1;
      }
      nextDate.setDate(nextDate.getDate()+1);
    }
    return weekendCount;
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