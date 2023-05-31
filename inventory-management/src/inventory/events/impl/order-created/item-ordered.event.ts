import { ItemSize } from "src/inventory/schemas/structs/size.enum";

export class itemOrderedEvent {
       constructor(
        public readonly _id : string,
        public readonly name: string,
        public readonly itemCode: string,
        public readonly size: ItemSize,
        public readonly amount: number,
        public readonly price: number,
    ) {}
}