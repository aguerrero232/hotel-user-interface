import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Hotel } from '../hotel.model';
import { HotelService } from '../hotel.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { User } from 'src/app/user/user.model';

@Component({
  selector: 'app-hotels-view-all',
  templateUrl: './hotels-view-all.component.html',
  styleUrls: ['./hotels-view-all.component.css']
})
export class HotelsViewAllComponent implements OnInit {

  hotel: any;
  hotels: Hotel[] = [];
  p_Hotels: Hotel[] = [];
  hotelsSub: Subscription;

  user: any;
  users: User[] = [];
  userSub: Subscription;
  usersSub: Subscription;

  constructor(private hotelService: HotelService, private userService: UserService, private modalService: NgbModal, private router: Router) { 
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
  }

  openViewHotel(content: any, hotel: Hotel){
    this.hotel = hotel;
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop'}); 

  }

  async reserveSelectedHotel(){
    this.modalService.dismissAll();
    this.hotelService.hotel = this.hotel;
    await this.hotelService.setHotel();
    this.router.navigate(["/reservation-complete"]);
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
