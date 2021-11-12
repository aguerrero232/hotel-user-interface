import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { HotelService } from '../hotel/hotel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user!: any;
  userSub: Subscription;  

  hotel: any;
  hotelSub: Subscription;

  isToggled: boolean = false;

  constructor(private userService: UserService, private hotelService: HotelService) {
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);
    this.hotelSub = this.hotelService.onHotelChange().subscribe(hotel => this.hotel = hotel);
  }

  ngOnInit(){
    let user;
    if(localStorage.getItem("user")){
      user = localStorage.getItem("user");
      if(user){
        user = JSON.parse(user);
      }
      this.user = user;
      this.userService.user = this.user;
      this.userService.setUser();      
    }
    else{
      this.user = this.userService.user;
    }
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  clearHotel(){
    this.hotelService.hotel = undefined;
  }

  signOut(){
    this.userService.user = undefined;
    this.user = undefined;
    localStorage.removeItem('user');    // localStorage.removeItem('id');
    localStorage.clear();   // localStorage.clear();
    // this.ngOnDestroy();
  }
  toggled(){
    this.isToggled = !this.isToggled;
  }
}
 

