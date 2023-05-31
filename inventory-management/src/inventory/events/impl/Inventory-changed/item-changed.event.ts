import { ItemSize } from "src/inventory/schemas/structs/size.enum";
import { Supplier } from "src/inventory/schemas/write-schemas/supplier.schema";

export class ItemChangedEvent {
    constructor(
        public name : string,
        public itemCode: string,
        public supplier: Supplier,
        public size : ItemSize,
        public price : number
    )
    {}
}