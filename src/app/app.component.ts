import { Component } from '@angular/core';
import { UserService } from './user/user.service';
import { User } from './user/user.model';
import { Subscription } from 'rxjs';
import { HotelService } from './hotel/hotel.service';
import { Hotel } from './hotel/hotel.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hotel-user-interface';
  
  hotels: Hotel[] = [];
  users: User[] = [];
  user: any;

  userSub: Subscription;
  usersSub: Subscription; 
  hotelsSub: Subscription;
  
 constructor(private userService: UserService, private hotelService: HotelService) { 

    this.userSub = this.userService.onUsersChange().subscribe( user => this.user = user); 

    this.usersSub = this.userService.onUsersChange().subscribe( users => this.users = users);
    
    this.hotelsSub = this.hotelService.onHotelsChange().subscribe(h => this.hotels = h);
  }

  ngOnInit(){
    this.userService.setUsers();
    this.hotelService.setHotels();
    
  }
  ngOnDestroy(){
    this.userSub.unsubscribe(); 
    this.usersSub .unsubscribe();
    this.hotelsSub.unsubscribe();
  }

}
