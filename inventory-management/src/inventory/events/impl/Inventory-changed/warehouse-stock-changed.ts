import { WareHouseLocation } from "../../../schemas/write-schemas/warehouse-location.schema";

export class WareHouseStockChangedEvent {
    constructor(
        public wareHouseLocation : WareHouseLocation,
        public amountRemoved: number
    )
    {}
}