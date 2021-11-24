import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { Hotel } from '../hotel.model';
import { HotelService } from '../hotel.service';

@Component({
  selector: 'app-admin-hotels-view',
  templateUrl: './admin-hotels-view.component.html',
  styleUrls: ['./admin-hotels-view.component.css']
})
export class AdminHotelsViewComponent implements OnInit {

  hotel: any;
  hotels: Hotel[] = [];
  
  hotelsSub: Subscription;
  hotelSub: Subscription;

  user: User | any;
  userSub: Subscription;

  p_Hotels: Hotel[] = [];


  constructor(private hotelService: HotelService, private userService: UserService, private modalService: NgbModal, private router: Router) { 
    this.hotelsSub = this.hotelService.onHotelsChange().subscribe(h => {this.hotels = h});
    this.hotelSub = this.hotelService.onHotelChange().subscribe(h => this.hotel = h);
    this.userSub = this.userService.onUserChange().subscribe( user => this.user = user);
  }

  ngOnInit(){
    this.hotelService.setHotels();
    this.user = this.userService.user;
    this.hotels = this.hotelService.hotels;
  }
  
  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.hotelSub.unsubscribe();
    this.hotelsSub.unsubscribe();
  }

  openViewHotel(content: any, hotel: Hotel){
    this.hotel = hotel;
    this.modalService.open(content); 

  }

  openEditHotel(content: any){
    this.modalService.dismissAll();
    this.modalService.open(content); 
  } 

  async deleteHotel(){
    let x = await this.hotelService.deleteHotel(this.hotel.id);
    this.modalService.dismissAll();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['user-information']);
    }); 
  } 
  
  async validateFormInputsUpdateHotel(form: NgForm){

    let amenities = ['Gym', 'Spa', 'Pool', 'Business Office', 'WiFi'];
    let id = this.hotel.id;
    let name = (form.value.name === undefined || form.value.name === "" ? this.hotel.name : form.value.name );
    let numRooms =  (form.value.numroomt === undefined || form.value.numRooms === "" ? this.hotel.numRooms : (form.value.numroomt > 0 ? form.value.numroomt : this.hotel.numRooms));
    let weekendDiff = (form.value.weekenddiff === undefined || form.value.weekenddiff === "" ? this.hotel.weekendDiff : (form.value.weekenddiff > 0 ? form.value.weekenddiff : this.hotel.weekendDiff));
    
    // room prices
    let sp = (form.value.standardp === undefined || form.value.standardp === "" ? this.hotel.rooms[0].price : (form.value.standardp > 0 ? form.value.standardp : this.hotel.rooms[0].price)); 
    let qp = (form.value.queenp === undefined || form.value.queenp === ""  ? this.hotel.rooms[1].price : (form.value.queenp > 0 ? form.value.queenp : 0));   
    let kp = (form.value.kingp === undefined || form.value.kingp === ""  ? this.hotel.rooms[2].price : (form.value.kingp > 0 ? form.value.kingp : 0));
    
    // quantities of rooms
    let sq = (form.value.standardq === undefined || form.value.standardq === "" ? this.hotel.rooms[0].numRoomsTotal : (form.value.standardq > 0 ? form.value.standardq : this.hotel.rooms[0].numRoomsTotal));    
    let qq = (form.value.queenq === undefined || form.value.queenq === "" ? this.hotel.rooms[1].numRoomsTotal : (qp === 0 ? 0 : form.value.queenq));
    let kq = (form.value.kingq === undefined || form.value.kingq === "" ? this.hotel.rooms[2].numRoomsTotal : (kp === 0 ? 0 : form.value.kingq))
    
    // checking if num rooms available is less than the new total
    if(this.hotel.rooms[1].numRoomsAvailable == undefined || qq < this.hotel.rooms[1].numRoomsAvailable)
      this.hotel.rooms[1].numRoomsAvailable = qq

    if(this.hotel.rooms[2].numRoomsAvailable == undefined || kq < this.hotel.rooms[2].numRoomsAvailable)
      this.hotel.rooms[2].numRoomsAvailable = kq

    if(form.value.numroomt > 0 ){
      if((sq + qq + kq) !== numRooms){
        alert("rooms dont add up to total!");
        return;
      }  
    }
  
    let rooms = [{  name:"Standard" , price: sp, numRoomsTotal: sq, numRoomsAvailable: this.hotel.rooms[0].numRoomsAvailable },
                   {  name:"Queen" , price: qp, numRoomsTotal: qq, numRoomsAvailable: this.hotel.rooms[1].numRoomsAvailable },
                   {  name:"King" , price: kp, numRoomsTotal: kq, numRoomsAvailable: this.hotel.rooms[2].numRoomsAvailable }]

    let selectedAmenities: string[] = [];

    Object.keys(form.value).filter(x => 
    { 
      if (form.value[x] !== ""){
        if(amenities.includes(x)){
            selectedAmenities.push(x);
        }        
      }
    });

    let hotel = new Hotel(id, this.user.id,name, selectedAmenities, numRooms, rooms, this.hotel.picture, weekendDiff);

    await this.hotelService.updateHotel(hotel);    
    await this.hotelService.setHotels();
    this.modalService.dismissAll();
    
    // refreshesh the component 
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['user-information']);
    }); 
  }

  parsedHotels(){
    let h: Hotel[] = [];
    
    this.p_Hotels = this.hotels.filter(h => h.adminId == this.user.id);

    this.p_Hotels.forEach( x => {
      if(!h.some(y => JSON.stringify(y) === JSON.stringify(x))){
        h.push(x);
      }
    });

    this.p_Hotels = h;
  }
}
