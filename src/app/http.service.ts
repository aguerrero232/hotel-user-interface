import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = { mode: 'no-cors', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  constructor(private http: HttpClient) {
  }

  get<T>(actionUrl: string): Promise<T> {
    return this.http.get<T>(actionUrl, httpOptions).toPromise();
  }
  
  post<T>(actionUrl: string, data: any): Promise<T> {
    return this.http.post<T>(actionUrl, data, httpOptions).toPromise();
  }

  put<T>(actionUrl: string, data: any): Promise<T> {
    return this.http.put<T>(actionUrl, data, httpOptions).toPromise();
  }

  patch<T>(actionUrl: string, data: any): Promise<T> {
    return this.http.patch<T>(actionUrl, data, httpOptions).toPromise();
  }
  
  delete<T>(actionUrl: string): Promise<T> {
    return this.http.delete<T>(actionUrl, httpOptions).toPromise();
  }

}
