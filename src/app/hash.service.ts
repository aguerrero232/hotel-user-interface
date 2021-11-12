import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HashService {
  constructor() { }
  
  //The set method is use for encrypt the value.
  set(value: string){
    var encrypted = CryptoJS.AES.encrypt(value, environment.hash_key);
    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(value: string){
    var decrypted = CryptoJS.AES.decrypt(value, environment.hash_key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}