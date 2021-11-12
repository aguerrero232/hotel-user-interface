import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {User} from '../user.model';
import { UserService } from '../user.service';
import { HashService } from '../../hash.service'

@Component({
  selector: 'app-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.css']
})
export class NewUserPageComponent implements OnInit {

  isValid = false;
  
  user: any;
  users: User[] = [];
  
  userSub: Subscription;
  usersSub: Subscription;

  constructor(private userService: UserService, private router: Router, private hashService: HashService) { 
    this.userSub = this.userService.onUserChange().subscribe(user => this.user = user );
    this.usersSub = this.userService.onUserChange().subscribe(user => this.users = user );  
  }

  ngOnInit(): void {
  }
  
  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.usersSub.unsubscribe();
  }
  
  async validateFormInputs(form: NgForm){
    
    let email = form.value.email;
    let password = form.value.password;
    let c_password = form.value.c_password;
    let name = form.value.name;

    this.users = this.userService.getUsers();

    let matched_emails = this.users.find(u => u.email == email );

    if(matched_emails){
      alert("Email is already in use.");
      return; 
    }

    if(c_password === password){
        this.isValid = true;           
      }
      else{
        alert("Passwords did not match.");
        return;
      } 
      
    if(this.isValid === true){
      let hashed_p = this.hashService.set(password);
      let user = new User("", email, hashed_p, name, [], 0);
      user = await this.userService.addUser(user);
      this.userService.setUsers();
      this.user = user;
      this.userService.user = this.user;
      this.userService.setUser();
      localStorage.setItem('user', JSON.stringify(this.user));   // store object
      this.router.navigate(['user-information']);  
    }
  }
}

//message
