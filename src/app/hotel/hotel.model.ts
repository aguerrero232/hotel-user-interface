export class Hotel{
    constructor(
        public id: string,
        public adminId: string,
        public name: string,    
        public amenities: string[],
        public numRooms: Number,
        public rooms: { name: string, price: number,  numRoomsTotal: number, numRoomsAvailable: number  }[],
        public picture: number,
        public weekendDiff: number,
        ){}
};
