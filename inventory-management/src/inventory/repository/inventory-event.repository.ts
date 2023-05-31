import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemStockChanged } from '../schemas/eventstore-schemas/item-stock-changed.schema';
import { AssortmentItem } from '../schemas/read-schemas/assortment-item.schema';

@Injectable()
export class InventoryEventRepository {
  @InjectModel(ItemStockChanged.name, 'itemStockChangeds-read')
  private readonly itemStockChangedModel: Model<ItemStockChanged>;
  @InjectModel(AssortmentItem.name, 'assortmentItems-read')
  private readonly assortmentItemReadModel: Model<AssortmentItem>;

  addItemStockChanged(itemStockChanged: ItemStockChanged) {
    let itemStockChangedToSave : ItemStockChanged = {item: itemStockChanged.item, updatedWareHouses: itemStockChanged.updatedWareHouses}
    const eventCreated = new this.itemStockChangedModel(itemStockChangedToSave);
    return eventCreated.save();
  }

  async getHighestStockAmount(itemId: string): Promise<number> {
    let item = await this.assortmentItemReadModel.findById(itemId)

    const result = await this.itemStockChangedModel.aggregate([
        {
          $match: {
            'item.itemCode': item.itemCode,
          },
        },
        {
          $unwind: '$updatedWareHouses',
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $group: {
            _id: '$item.itemCode',
            updates: {
              $push: '$updatedWareHouses.amountRemoved',
            },
          },
        },
        {
          $project: {
            cumulativeAmounts: {
              $map: {
                input: '$updates',
                as: 'update',
                in: {
                  $reduce: {
                    input: {
                      $slice: ['$updates', 0, { $add: [{ $indexOfArray: ['$updates', '$$update'] }, 1] }],
                    },
                    initialValue: 0,
                    in: { $subtract: ['$$value', '$$this'] },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            highestCumulativeAmount: {
              $max: '$cumulativeAmounts',
            },
          },
        },
      ]);
  
      return result.length > 0 ? result[0].highestCumulativeAmount : 0;
    }
}
