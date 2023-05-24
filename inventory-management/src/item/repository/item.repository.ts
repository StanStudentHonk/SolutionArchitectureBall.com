import { Injectable } from '@nestjs/common';
import { Item } from '../schemas/item.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ItemRepository {
  private readonly items: Item[] = [];
  @InjectModel(Item.name, 'items-write')
  private readonly itemWriteModel: Model<Item>
  
  create(item: Item) {
    this.items.push(item);
  }

  async findOneById(id: string): Promise<Item> {
    return;
  }

  async findAll(): Promise<Item[]> {
    return this.items;
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
    item.wareHouseStock = item.wareHouseStock.map((stock) => {
      if (remainingQuantityToRemove <= 0) {
        return stock;
      }
  
      const updatedAmount = stock.amount - remainingQuantityToRemove;
      if (updatedAmount >= 0) {
        remainingQuantityToRemove = 0;
        return { ...stock, amount: updatedAmount };
      } else {
        remainingQuantityToRemove = Math.abs(updatedAmount);
        return { ...stock, amount: 0 };
      }
    });
  
    // Save the updated item
    await item.save();
  }
}
