import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssortmentItem } from '../schemas/read-schemas/assortment-item.schema';
import { Item } from '../schemas/write-schemas/item.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class InventoryRepository {
  @InjectModel(Item.name, 'items-write')
  private readonly itemWriteModel: Model<Item>;
  @InjectModel(AssortmentItem.name, 'assortmentItems-read')
  private readonly assortmentItemReadModel: Model<AssortmentItem>;

  findAssortmentItemsByLimit(limit: number) {
    return this.assortmentItemReadModel.find().limit(limit);
  }

  async removeItemsByWareHouses(itemId: string, quantityToRemove: number) {
    // Check if quantityToRemove is a valid number
    if (quantityToRemove < 1) {
      throw new Error('Invalid quantity to remove');
    }

    // Find the item with the given itemId
    const item = await this.itemWriteModel.findById(itemId);

    // Check if the item exists
    if (!item) {
      throw new Error('Item not found');
    }

    // Iterate through each warehouse stock entry of the item and update the amount
    let remainingQuantityToRemove = quantityToRemove;
    let updatedWarehouses = [];
    item.wareHouseStock = item.wareHouseStock.map((stock) => {
      if (remainingQuantityToRemove <= 0) {
        return stock;
      }

      const updatedAmount = stock.amount - remainingQuantityToRemove;
      if (updatedAmount >= 0) {
        updatedWarehouses.push({
          _id: stock['_id'],
          wareHouseLocation: stock.wareHouseLocation,
          amountRemoved: remainingQuantityToRemove,
        });
        remainingQuantityToRemove = 0;
        stock.amount = updatedAmount;
        return { ...stock, amount: updatedAmount };
      } else {
        updatedWarehouses.push({
          _id: stock['_id'],
          wareHouseLocation: stock.wareHouseLocation,
          amountRemoved: stock.amount,
        });
        remainingQuantityToRemove = Math.abs(updatedAmount);
        return { ...stock, amount: 0 };
      }
    });

    // Save the updated item
    await item.save();

    // Return the updated warehouses and item object
    return { updatedWarehouses, item };
  }

  addItemToInventory(item: Item) {
    const itemCreated = new this.itemWriteModel(item);
    return itemCreated.save();
  }

  async addItemStock(
    itemId: string,
    warehouseStockId: string,
    amountToAdd: number,
  ) {
    let itemChanged = await this.itemWriteModel.findOneAndUpdate(
      { _id: itemId, 'wareHouseStock._id': warehouseStockId },
      { $inc: { 'wareHouseStock.$.amount': amountToAdd } },
      { new: true, useFindAndModify: false },
    );

    // Find the updated warehouseStock
    const updatedWarehouseStock = itemChanged.wareHouseStock.find((stock) => {
      return new ObjectId(warehouseStockId).equals(stock['_id']);
    });

    // Return only the item and the updated warehouseStock
    return {
      item: itemChanged,
      warehouseStock: updatedWarehouseStock,
    };
  }

  async assortmentItemExist(itemId): Promise<boolean> {
    let exist = await this.assortmentItemReadModel.countDocuments({
      _id: itemId,
    });
    return exist > 0;
  }

  addItemToAssortment(item: AssortmentItem) {
    const itemCreated = new this.assortmentItemReadModel(item);
    return itemCreated.save();
  }

  async updateAssortmentItem(itemId: string, amount: number) {
    const updatedDocument = await this.assortmentItemReadModel
      .findByIdAndUpdate(
        itemId,
        { $inc: { amount: -amount } },
        { new: true, runValidators: true },
      )
      .exec();
    return updatedDocument;
  }
}
