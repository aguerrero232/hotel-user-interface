import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpService } from '../http.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  user: any;
  users: User[] = [];

  userSub = new Subject<User>();
  usersSub = new Subject<User[]>();

  constructor(private http: HttpService) {
    this.userSub.subscribe(u => this.user = u);
    this.usersSub.subscribe(u => this.users = u);
  }

  async setUsers(){
    this.users = [];
    
    let endpoint = "https://hotel-system-api.herokuapp.com/users";
    this.http.get(endpoint).then(data => {
      let values = JSON.parse(JSON.stringify(data))
      values.forEach( ( value: any) => {
        let u = new User(value._id, value.email, value.password, value.name, value.isAdmin);
        this.users.push(u);
      });
    });
    
    this.usersSub.next(this.users);
  }
  
  setUser(){
    this.userSub.next(this.user);
  }

  getUsers(){
    return this.users;
  }
  
  getUser(){
    return this.user;
  }

  getUserID(id: string){
    return this.users.find(u => u.id === id);
  }


  async addUser(user: User){

    let endpoint = "https://hotel-system-api.herokuapp.com/users";
    
    let body = {
      "email": user.email,
      "password": user.password,
      "name": user.name,
      "isAdmin": user.isAdmin 
    }

    return this.http.post(endpoint, body).then(data => {
      let value = JSON.parse(JSON.stringify(data));
      user.id = value._id;
      return user;
    }
    );
  }

  updateUser(updatedUser: User){

    let endpoint = "https://hotel-system-api.herokuapp.com/users/"+ updatedUser.id;
    
    let body = {
      "email": updatedUser.email,
      "password": updatedUser.password,
      "name": updatedUser.name,
      "isAdmin": updatedUser.isAdmin 
    }

    return this.http.put(endpoint, body );
  }

  onUserChange(): Observable<any> {
    return this.userSub.asObservable(); 
  }
  
  onUsersChange(): Observable<any> {
    return this.usersSub.asObservable(); 
  }
}

