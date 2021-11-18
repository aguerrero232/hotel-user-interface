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

  hotelsFound: Hotel[] = [];
  hotels: Hotel[] = [];
  hotelsSub: Subscription;  
  
  hotel: any;
  hotelSub: Subscription;

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
    this.hotelsFound = this.hotelParser.getParsedHotels();
    this.reservation = { id: "", _hotelId: "", _userId: "", room: { name: "", price: 0 }, start: "", end: "", price: 0 }
    this.hotels = this.hotelService.hotels;
  }
 
  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.hotelSub.unsubscribe();
    this.hotelsSub.unsubscribe();
  }

  onSubmit(form: NgForm) {

    this.hotels = this.hotelService.hotels;

    let htl: Hotel[] = [];
    let p_h: Hotel[] = [];
    let finalCriteria: Hotel[] = [];
    let priceMatchedHotels = [];
    let wantedAmenities: string[] = [];
    
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

    for(let i = 0; i < htl.length; i++){
      let c_h_r = htl[i].rooms.filter(h_r => h_r.price <= this.priceRange);    
      if(c_h_r.length > 0){
        let zero_min_check = c_h_r.filter(room => room.price != 0);
        let min_check = zero_min_check.filter(room => room.price <= this.priceRange);
        if(min_check.length > 0)
          priceMatchedHotels.push(htl[i]);
      }
    }

    if(priceMatchedHotels.length <= 0){
      alert("No Hotels fit that criteria!")
      return;
    }
    
    if(wantedAmenities.length == 0){
     
      priceMatchedHotels.forEach( x => {
      if(!p_h.some(y => JSON.stringify(y) === JSON.stringify(x))){
        p_h.push(x)
      }
      });

      this.hotelParser.setParsedHotels(p_h);
      this.hotelsFound = p_h;
      return;
    }

    for(let i = 0; i < priceMatchedHotels.length; i++){   
      if(this.isSubArray(priceMatchedHotels[i].amenities, wantedAmenities, priceMatchedHotels[i].amenities.length, wantedAmenities.length)){
        finalCriteria.push(priceMatchedHotels[i]);
      }
    }

    
    finalCriteria.forEach( x => {
      if(!p_h.some(y => JSON.stringify(y) === JSON.stringify(x))){
        p_h.push(x)
      }
    });

    this.hotelParser.setParsedHotels(p_h);
    this.hotelsFound = p_h;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['reservation-form']);
    });

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

  isSubArray(A: string[], B: string[], n: number, m: number){
    // Two pointers to traverse the arrays
    var i = 0, j = 0;
    // Traverse both arrays simultaneously
    while (i < n && j < m) {
      // If element matches
      // increment both pointers
      if (A[i] == B[j]) {
        i++;
        j++;
        // If array B is completely
        // traversed
        if (j == m)
          return true;
      }
      // If not,
      // increment i and reset j
      else {
        i = i - j + 1;
        j = 0;
      }
    }
    return false;
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
