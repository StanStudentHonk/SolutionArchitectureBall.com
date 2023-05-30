import { Customer } from "./customer.interface";

export interface Order {
    _id : string,
    customer: Customer;
    orderDate: Date;
    deliveryAdress: string;
    deliveryDate: Date;
}