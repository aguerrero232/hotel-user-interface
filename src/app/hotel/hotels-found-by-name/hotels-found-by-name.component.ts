import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { Hotel } from '../hotel.model';
import { HotelService } from '../hotel.service';
import { ParseHotelsService } from '../parse-hotels.service';

@Component({
  selector: 'app-hotels-found-by-name',
  templateUrl: './hotels-found-by-name.component.html',
  styleUrls: ['./hotels-found-by-name.component.css']
})
export class HotelsFoundByNameComponent implements OnInit {
  hotelsFound: Hotel[] = [];
  hotel: any;
  user: any;
  users: User[] = [];
  userSub: Subscription;
  usersSub: Subscription;

  constructor(private hotelService: HotelService, private userService: UserService, private hotelParser: ParseHotelsService, private modalService: NgbModal, private router: Router) { 
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);   
    this.usersSub = this.userService.onUsersChange().subscribe( users => this.users = users);    
  }

  ngOnInit(){
    this.hotelsFound = this.hotelParser.getParsedHotels();
    this.user = this.userService.user;
    this.users = this.userService.users;
  }
  
  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.usersSub.unsubscribe();
  }

  openViewHotel(content: any, hotel: Hotel){
    this.hotel = hotel;
    this.modalService.open(content); 
  }

  reserveSelectedHotel(){
    this.modalService.dismissAll();
    this.hotelService.hotel = this.hotel;
    this.hotelService.setHotel();
    this.router.navigate(["/reservation-complete"]);
  } 


}
