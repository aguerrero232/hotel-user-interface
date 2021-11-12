import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; 
import { Reservation } from '../reservation.model';
import { User } from '../../user/user.model';
import { Hotel } from '../../hotel/hotel.model';
import { UserService } from '../../user/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HotelService } from '../../hotel/hotel.service';
import { ParseHotelsService } from '../../hotel/parse-hotels.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

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

  finalCriteria: Hotel[] = [];

  amenities = ['Gym', 'Spa', 'Pool', 'Business Office', 'WiFi'];
  
  constructor(private userService: UserService, private hotelService: HotelService, private modalService: NgbModal, private hotelParser: ParseHotelsService, private router: Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter){
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);
    this.hotelsSub = this.hotelService.onHotelsChange().subscribe(hotel => this.hotels = hotel);
    this.hotelSub = this.hotelService.onHotelChange().subscribe(hotel => this.hotel = hotel);
  }
  
  ngOnInit(): void {
    if(this.hotelService.hotel != undefined){
      this.hotel = this.hotelService.hotel;
    }
    this.user = this.userService.user;
    if(this.user === undefined){
      this.router.navigate(["/sign-in"]); 
    }
    this.reservation = {
      id: "",
      _hotelId: "",
      _userId: "",
      room: {
        name: "",   
        price: 0
      },
      start: "",
      end: "", 
      price: 0
    }
    this.hotels = this.hotelService.hotels;
  }
 
  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.hotelSub.unsubscribe();
    this.hotelsSub.unsubscribe();
  }

  onSubmit(form: NgForm): void {
   
    this.finalCriteria = [];
    
    let wantedAmenities: string[] = [];
    
    let htl: Hotel[] = [];
    
    this.hotels.forEach( x => {
      if(!htl.some(y => JSON.stringify(y) === JSON.stringify(x))){
        htl.push(x)
      }
    });

    if(form.invalid) {
      console.log("Invalid form");
      return;
    }

    this.reservation.price = form.value.priceRange;
    this.reservation.start = (this.fromDate?.year + "-"+ this.fromDate?.month + "-" + this.fromDate?.day);
    this.reservation.end = (this.toDate?.year + "-"+ this.toDate?.month + "-" + this.toDate?.day); 
    this.reservation.room.name = form.value['room'];

    Object.keys(form.value).filter(x => 
    { 
      if (form.value[x] !== ""){
        if(this.amenities.includes(x)){
            wantedAmenities.push(x);
        }        
      }
    });

    let matchedHotels = [];

    for(let i = 0; i < htl.length; i++){
      let c_h_r = htl[i].rooms.filter(h_r => h_r.price <= this.priceRange);
      if(c_h_r)
        matchedHotels.push(htl[i]);
    }
    
    if(matchedHotels.length <= 0){
      alert("No Hotels fit that criteria!")
      return;
    }
    
    if(wantedAmenities.length == 0){
      matchedHotels;
      return;
    }
   
    for(let i = 0; i < matchedHotels.length; i++){  
      let checker = (arr: string | any[], target: any[]) => target.every((v: any) => arr.includes(v));
      if(!checker(matchedHotels[i].amenities, wantedAmenities))
        matchedHotels.splice(i,1)
    }
 
    this.finalCriteria = matchedHotels;
    return;    
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

  metCriteria(){
    return this.finalCriteria;
  }

  openViewHotel(content: any, hotel: Hotel){
    this.hotel = hotel;
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop'}); 

  }

  reserveSelectedHotel(){
    this.modalService.dismissAll();
    this.hotelService.hotel = this.hotel;
    this.hotelService.setHotel();
    this.router.navigate(["/reservation-complete"]);
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
