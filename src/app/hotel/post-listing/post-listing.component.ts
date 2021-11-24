import { HotelService } from './../hotel.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';
import { Subscription } from 'rxjs';
import { Hotel } from '../hotel.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-listing',
  templateUrl: './post-listing.component.html',
  styleUrls: ['./post-listing.component.css']
})
export class PostListingComponent implements OnInit {

  user!: User;
  userSub: Subscription;  

  hotels: Hotel[] = [];
  hotelsSub: Subscription;  
  
  hotel: any;
  hotelSub: Subscription;

  amenities = ['Gym', 'Spa', 'Pool', 'Business Office', 'WiFi'];
  
  constructor(private userService: UserService, private hotelService: HotelService,  private router: Router) {
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);
    this.hotelsSub = this.hotelService.onHotelsChange().subscribe(hotel => {this.hotels = hotel; console.log("Hotels Updated in post listing")});
    this.hotelSub = this.hotelService.onHotelChange().subscribe(hotel => this.hotel = hotel);
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if(this.user === undefined || this.user.isAdmin ==0){
      this.router.navigate(["/"]);
    }
    this.hotels = this.hotelService.hotels;
  }
  
  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.hotelSub.unsubscribe();
    this.hotelsSub.unsubscribe();
  }

  async validateFormInputs(form: NgForm){
    
    let name = form.value.name;
    let numRooms = form.value.numroomt;
    let weekendDiff = form.value.weekenddiff;

    let sp = form.value.standardp;
    let qp = (form.value.queenp > 0 ? form.value.queenp : 0);
    let kp = (form.value.kingp > 0 ? form.value.kingp : 0);

    // check if sq + qq + kq == numRooms
    let sq = form.value.standardq;
    let qq = (qp <= 0 ? 0 : form.value.queenq);
    let kq = (kp <= 0 ? 0 : form.value.kingq);

    if((sq + qq + kq) !== numRooms){
      alert("rooms dont add up to total!");
      return;
    }

    let rooms = [{  name:"Standard" , price: sp, numRoomsTotal: sq, numRoomsAvailable: sq },
                   {  name:"Queen" , price: qp, numRoomsTotal: qq, numRoomsAvailable: qq },
                   {  name:"King" , price: kp, numRoomsTotal: kq, numRoomsAvailable: kq }]

    let selectedAmenities: string[] = [];

    Object.keys(form.value).filter(x => 
    { 
      if (form.value[x] !== ""){
        if(this.amenities.includes(x)){
            selectedAmenities.push(x);
        }        
      }
    });

    let hotel: Hotel = new Hotel ( "", this.user.id,name, selectedAmenities, numRooms, rooms, 0, weekendDiff);

    await this.hotelService.addHotel(hotel);    
    await this.hotelService.setHotels();

    this.router.navigate(['/']);    
  }
}
