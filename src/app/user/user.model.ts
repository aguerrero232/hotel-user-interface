export class User{
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public name: string,
        public reservationIds: string[],
        public isAdmin: number) {
    }
};