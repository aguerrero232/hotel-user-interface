import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {User} from "../user.model";
import {UserService} from '../user.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HashService } from 'src/app/hash.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  user: any;
  users: User[] = [];

  usersSub: Subscription;
  
  constructor( private router: Router, private userService: UserService, private hashService: HashService) { 
    this.usersSub = this.userService.onUsersChange().subscribe( users => this.users = users);   

  }

  ngOnInit(): void {
    this.users = this.userService.users;
  }
  
  ngOnDestroy(){
    this.usersSub.unsubscribe();
  }

  checkData(form: NgForm){
    this.users = this.userService.getUsers();
    let email = form.value.email;
    let password = form.value.password;
    let matched_emails_and_password = this.users.find(u => u.email == email && this.hashService.get(u.password) == password);
    if(matched_emails_and_password){
      this.user = matched_emails_and_password;
      this.userService.user = this.user;
      this.userService.setUser();
      localStorage.setItem('user', JSON.stringify(this.user));   // store object
      this.router.navigate(['/user-information/']);
      return;
    }
    else{
      alert("Couldn't find user with those credentials :(");
      return;
    }  
  }

}
