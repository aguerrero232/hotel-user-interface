import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { Hotel } from '../hotel.model';
import { HotelService } from '../hotel.service';
import { ParseHotelsService } from '../parse-hotels.service';

@Component({
  selector: 'app-hotel-search-by-name',
  templateUrl: './hotel-search-by-name.component.html',
  styleUrls: ['./hotel-search-by-name.component.css']
})
export class HotelSearchByNameComponent implements OnInit {

  hotel: any;
  hotels: Hotel[] = [];
  p_Hotels: Hotel[] = [];
  hotelsSub: Subscription;

  user: any;
  users: User[] = [];
  userSub: Subscription;
  usersSub: Subscription;

  constructor(private hotelService: HotelService, private userService: UserService, private hotelParser: ParseHotelsService, private modalService: NgbModal, private router: Router) { 
    this.hotelsSub = this.hotelService.onHotelsChange().subscribe(h => this.hotels = h);
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);   
    this.usersSub = this.userService.onUsersChange().subscribe( users => this.users = users);    
  }

  ngOnInit(){
    this.hotelService.setHotels();
    this.hotels = this.hotelService.hotels;
    this.user = this.userService.user;
    this.users = this.userService.users;
  }
  
  ngOnDestroy(){
    this.hotelsSub.unsubscribe();
    this.userSub.unsubscribe();
    this.usersSub.unsubscribe();
  }

  openViewHotel(content: any, hotel: Hotel){
    this.hotel = hotel;
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop'}); 
  }

  searchHotel(form: NgForm){
    let hotelName = form.value.hotelName;
    let htl: Hotel[] = [];

    this.hotels.forEach( x => {
      if(!htl.some(y => JSON.stringify(y) === JSON.stringify(x))){
        htl.push(x)
      }
    });
    
    let filtered = htl.filter(h => h.name.toLowerCase().includes(hotelName.toLowerCase()));
    this.hotelParser.setParsedHotels(filtered);
    this.router.navigate(["/hotels-by-name"]);
  }

  parsedHotels(){
    let h: Hotel[] = [];
    
    this.hotels.forEach( x => {
      if(!h.some(y => JSON.stringify(y) === JSON.stringify(x))){
        h.push(x);
      }
    });
    
    this.p_Hotels = h;
  }

}
