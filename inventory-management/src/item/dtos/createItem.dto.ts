import { Warehouse } from "src/warehouse/warehouse.interface";

export class CreateItemDto {
    id: number;
    name: string;
    amount: number;
    supplier: string;
    warehouse: Warehouse;
}