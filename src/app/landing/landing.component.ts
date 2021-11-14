import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  user: any;
  usersSub: Subscription; 
  
 constructor(private userService: UserService,  private router: Router) { 
    this.usersSub = this.userService.onUserChange().subscribe( user => this.user = user);   
  }

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  ngOnDestroy(){
    this.usersSub.unsubscribe();
  }

}
