import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export class Reservation{
  constructor(
    public id: string,
    public _hotelId: string,
    public _userId: string,
    public room: { name: string, price: number},  
    public start: string,
    public end: string,
    public price: number) {
  }
};