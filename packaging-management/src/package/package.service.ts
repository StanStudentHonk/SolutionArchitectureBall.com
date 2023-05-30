import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageSchema } from './schemas/package.schema';
import { Order } from './schemas/order.schema';
import { WarehouseLocationDocument } from './schemas/WarehouseLocation.Schema';
import { Item, ItemDocument } from './schemas/item.schema';

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
    routingKey: 'items-reserved',
    queue: 'package',
  })
  public async itemsReservedHandler(msg: { Order: Order }) {
    // Get order from msg
    const order = msg.Order;

    // Create an array to store the packages
    const warehouses = new Map<string, [Item, number][]>();

    const items = order.items;

    for (const item of items) {
      const warehouse = item[0].warehouseLocation.warehouse;
      // Check if a package with the same warehouse already exists
      if (!warehouses.has(warehouse)) {
        warehouses.set(warehouse, []);
      }
      warehouses.get(warehouse).push(item);
    }

    // Create a package for each warehouse
    for (const warehouse of warehouses) {
      //create list of packages
      const Packages: Package[] = [];
      const itemsFromWarehouse = warehouse[1];

      for (const itemFromWarehouse of itemsFromWarehouse) {
        if (itemFromWarehouse[0].size == Size.S) {
          const smallPackages = HandleSmallPackages(itemFromWarehouse, warehouse[0]);
          Packages.push(...smallPackages);
        }else if (itemFromWarehouse[0].size == Size.M) {
          const mediumPackages = HandleMediumPackages(itemFromWarehouse, warehouse[0]);
          Packages.push(...mediumPackages);
        }else{
          const largePackages = HandleLargePackages(itemFromWarehouse, warehouse[0]);
          Packages.push(...largePackages);
        }
      }

      //order the packages by size
      


      //save packages
      for (const packageToSave of Packages) {
        await this.createPackage(packageToSave);
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
          Adress: order.deliveryAdress,
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
          Adress: order.deliveryAdress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse[0],
          WeightInKg: 8 * itemFromWarehouse[0].weight,
          Size: Size.M
        };
        Packages.push(newPackage);
      }

      for (let i = 0; i < itemsLeft2; i++) {
        const newPackage: Package = {
          Adress: order.deliveryAdress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse[0],
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
        const newPackage: Package = {
          Adress: order.deliveryAdress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse[0],
          WeightInKg: 8 * itemFromWarehouse[0].weight,
          Size: Size.L
        };
        Packages.push(newPackage);
      }

      for (let i = 0; i < itemsLeft; i++) {
        const newPackage: Package = {
          Adress: order.deliveryAdress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfMediumsInOneLarge]]),
          Warehouse: warehouse[0],
          WeightInKg: itemFromWarehouse[0].weight,
          Size: Size.M
        };
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
          Adress: order.deliveryAdress,
          items: new Map([[itemFromWarehouse[0], maxAmountOfLargesInOneLarge]]),
          Warehouse: warehouse[0],
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
