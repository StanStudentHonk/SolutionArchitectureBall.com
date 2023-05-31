import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageSchema } from './schemas/package.schema';
import { Order } from './schemas/order.schema';
import { WarehouseLocation, WarehouseLocationDocument , WarehouseLocationSchema} from './schemas/WarehouseLocation.Schema';
import { Item, ItemDocument } from './schemas/item.schema';
import { cwd } from 'process';


@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name, 'packages-read')
    private readonly packageReadModel: Model<Package>,
    private readonly amqpConnection: AmqpConnection,
    @InjectModel(Package.name, 'packages-write')
    private readonly packageWriteModel: Model<Package>,
  ) {}

  async createPackage(givenPackage: Package): Promise<Package> {
    const newPackage = new this.packageWriteModel(givenPackage);
    this.amqpConnection.publish<Package>(
      'BALLpuntcom',
      'package-created',
      newPackage,
    );
    return newPackage.save();
  }

  async getPackages(): Promise<Package[]> {
    return this.packageReadModel.find().exec();
  }

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: 'inventory-changed-by-order',
    queue: 'package',
  })
  public async itemsReservedHandler(msg: any) {
    // Get order from msg
    const message = msg;
    console.log("Msg: ");
    console.log(msg);
    console.log("Message.payload.items: ");
    console.log( message.payload.items);
    console.log("Message.payload.items[0].updatedWareHouses: ");
    console.log(message.payload.items[0].updatedWareHouses);
    
    const order = msg.payload.order;
    //check if order has delivery address
    if (order.deliveryAddress == undefined) {
      console.log("Order has no delivery address");
      order.deliveryAddress = "No delivery address defined";
    }
    console.log(order);
    const itemsWithUpdatedWarehouse = msg.payload.items;
    const items: [Item, number][] = [];
    for (const itemWithUpdatedWarehouse of itemsWithUpdatedWarehouse) {
      itemWithUpdatedWarehouse.updatedWareHouses.forEach(updatedWareHouse => {
        const item :  [Item, number] = [itemWithUpdatedWarehouse.item, updatedWareHouse.amountRemoved];
          let warehouseLocatie : WarehouseLocation = updatedWareHouse.wareHouseLocation;
          item[0].warehouseLocation = warehouseLocatie;
          items.push(item);
      });
    }

    // Create an array to store the packages
    const warehouses = new Map<string, [Item, number][]>();

    for (const item of items) {
      const warehouse = item[0].warehouseLocation.wareHouse;
      // Check if a package with the same warehouse already exists
      if (!warehouses.has(warehouse)) {
        warehouses.set(warehouse, []);
      }
      console.log("item: ----------------");
      console.log(item);
      //check if item has weight
      if (item[0].weight == undefined) {
        item[0].weight = 0;
      }
      
      warehouses.get(warehouse).push(item);
    }

    // Create a package for each warehouse
    for (const warehouse of warehouses) {
      //create list of packages
      const Packages: Package[] = [];
      const itemsFromWarehouse = warehouse[1];

      for (const itemFromWarehouse of itemsFromWarehouse) {
        console.log("itemFromWarehouse size: ----------------");
        console.log(itemFromWarehouse[0].size);

        if (itemFromWarehouse[0].size == Size.S) {
          const smallPackages = HandleSmallPackages(itemFromWarehouse, warehouse[0]);
          Packages.push(...smallPackages);
        }else if (itemFromWarehouse[0].size == Size.M) {                                                                                                         
          const mediumPackages = HandleMediumPackages(itemFromWarehouse, warehouse[0]);
          console.log("mediumPackages: ----------------");
          console.log(mediumPackages);
          Packages.push(...mediumPackages);
        }else{
          const largePackages = HandleLargePackages(itemFromWarehouse, warehouse[0]);
          Packages.push(...largePackages);
        }
      }

      //check if medium packages can be created
      const sPackages = extractAndRemoveSmallPackages(Packages, warehouse[0]);
      Packages.push(...sPackages);
      const mPackages = extractAndRemoveMediumPackages(Packages, warehouse[0]);
      Packages.push(...mPackages);

      //save packages
      for (const packageToSave of Packages) {
        console.log("packageSend: -_-_-_-_-_-_-_-_-_-_-_-_-");
        console.log(packageToSave);
        await this.createPackage(packageToSave);
      }
    }

    function extractAndRemoveMediumPackages(packages: Package[], warehouse: string): Package[] {
      const mPackages: Package[] = [];
      for (let i = packages.length - 1; i >= 0; i--) {
        if (packages[i].Size === Size.M) {
          mPackages.push(packages.splice(i, 1)[0]);
        }
      }

      //combine small packages
      const maxAmountOfMediumsInOneLarge = 8;
      const [amountOfLargePackages, itemsLeft] = calculateDivision(
        mPackages.length,
        maxAmountOfMediumsInOneLarge,
      );

      CreateLarges();
      return mPackages;

      function CreateLarges() {
        for (let i = 0; i < amountOfLargePackages; i++) {
          const newPackage: Package = {
            Adress: order.deliveryAddress,
            items: new Map(),
            Warehouse: warehouse[0],
            WeightInKg: 0,
            Size: Size.L
          };
          for (let j = 0; j < maxAmountOfMediumsInOneLarge; j++) {
            const item = mPackages.pop();
            newPackage.items.set(item.items.keys().next().value, 1);
            newPackage.WeightInKg += item.items.keys().next().value.weight;
          }
          packages.push(newPackage);
        }
      }
    }

    function extractAndRemoveSmallPackages(packages: Package[], warehouse: string): Package[] {
      const sPackages: Package[] = [];
      for (let i = packages.length - 1; i >= 0; i--) {
        if (packages[i].Size === Size.S) {
          sPackages.push(packages.splice(i, 1)[0]);
        }
      }

      //combine small packages
      const maxAmountOfSmallsInOneMedium = 8;
      const [amountOfMediumPackages, itemsLeft] = calculateDivision(
        sPackages.length,
        maxAmountOfSmallsInOneMedium,
      );

      CreateMediums();
      return sPackages;

      function CreateMediums() {
        for (let i = 0; i < amountOfMediumPackages; i++) {
          const newPackage: Package = {
            Adress: order.deliveryAddress,
            items: new Map(),
            Warehouse: warehouse[0],
            WeightInKg: 0,
            Size: Size.M
          };
          for (let j = 0; j < maxAmountOfSmallsInOneMedium; j++) {
            const item = sPackages.pop();
            newPackage.items.set(item.items.keys().next().value, 1);
            newPackage.WeightInKg += item.items.keys().next().value.weight;
          }
          packages.push(newPackage);
        }
      }
    }
     
    function HandleSmallPackages( itemFromWarehouse: [Item, number],warehouse: string,
    ): Package[] {
      const Packages: Package[] = [];
      const maxAmountOfSmallsInOneLarge = 64;

      //check if large packages can be created
      const [amountOfLargePackages, itemsLeft] = calculateDivision(
        itemFromWarehouse[1],
        maxAmountOfSmallsInOneLarge,
      );

      for (let i = 0; i < amountOfLargePackages; i++) {
        const newPackage: Package = {
          Adress: order.deliveryAddress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfSmallsInOneLarge]]),
          Warehouse: warehouse[0],
          WeightInKg: 64 * itemFromWarehouse[0].weight,
          Size: Size.L
        };
        Packages.push(newPackage);
      }

      //check if medium packages can be created
      const maxAmountOfMediumsInOneLarge = 8;
      const [amountOfMediumPackages, itemsLeft2] = calculateDivision(
        itemsLeft,
        maxAmountOfMediumsInOneLarge,
      );

      for (let i = 0; i < amountOfMediumPackages; i++) {
        const newPackage: Package = {
          Adress: order.deliveryAddress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse,
          WeightInKg: 8 * itemFromWarehouse[0].weight,
          Size: Size.M
        };
        Packages.push(newPackage);
      }

      for (let i = 0; i < itemsLeft2; i++) {
        const newPackage: Package = {
          Adress: order.deliveryAddress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse,
          WeightInKg: itemFromWarehouse[0].weight,
          Size: Size.S
        };
        Packages.push(newPackage);
      }
      return Packages;
    }

    function HandleMediumPackages( itemFromWarehouse: [Item, number],warehouse: string,
    ): Package[] {
      const Packages: Package[] = [];
      const maxAmountOfMediumsInOneLarge = 8;
      //check if large packages can be created
      const [amountOfLargePackages, itemsLeft] = calculateDivision(
        itemFromWarehouse[1],
        maxAmountOfMediumsInOneLarge,
      );
      for (let i = 0; i < amountOfLargePackages; i++) {
        console.log('largepackage has '+ order.deliveryAddress);
        const newPackage: Package = {
          Adress: order.deliveryAddress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse,
          WeightInKg: 8 * itemFromWarehouse[0].weight,
          Size: Size.L
        };
        Packages.push(newPackage);
      }

      for (let i = 0; i < itemsLeft; i++) {
        console.log('medium has '+ order.deliveryAddress);
        const newPackage: Package = {
          Adress: order.deliveryAddress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse,
          WeightInKg: itemFromWarehouse[0].weight,
          Size: Size.M
        };
        console.log(newPackage);
        Packages.push(newPackage);
      }
      return Packages;
    }

    function HandleLargePackages( itemFromWarehouse: [Item, number], warehouse: string,
    ): Package[] {
      const Packages: Package[] = [];
      const maxAmountOfLargesInOneLarge = 1;
      
      for (let i = 0; i < itemFromWarehouse[1]; i++) {
        const newPackage: Package = {
          Adress: order.deliveryAddress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfLargesInOneLarge]]),
          Warehouse: warehouse,
          WeightInKg: maxAmountOfLargesInOneLarge * itemFromWarehouse[0].weight,
          Size: Size.L
        };
        Packages.push(newPackage);
      }
      return Packages;
    }

    function calculateDivision(
      dividend: number,
      divisor: number,
    ): [number, number] {
      const quotient = Math.floor(dividend / divisor);
      const remainder = dividend % divisor;
      return [quotient, remainder];
    }
  }
}
