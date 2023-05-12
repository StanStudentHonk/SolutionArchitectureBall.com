import { Warehouse } from "src/warehouse/warehouse.interface";

export interface Item {
    id : number;
    name: string;
    amount: number;
    supplier: string;
    warehouse: Warehouse
}