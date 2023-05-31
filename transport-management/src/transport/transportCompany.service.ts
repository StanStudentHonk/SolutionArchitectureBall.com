import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransportCompany } from './schemas/transportCompany.schema';
import { Console } from 'console';
import { Package } from './schemas/package.schema';
import { RabbitMQEvent } from './schemas/rabbitMQEvent.event';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TransportCompanyService {

  constructor(
    @InjectModel(TransportCompany.name, 'transports-read')
    private readonly transportReadModel: Model<TransportCompany>,

    @InjectModel(TransportCompany.name, 'transports-write')
    private readonly transportWriteModel: Model<TransportCompany>,

    @InjectModel(Package.name, 'transports-write')
    private readonly packageWriteModel: Model<Package>,

    @InjectModel(Package.name, 'transports-read')
    private readonly packageReadModel: Model<Package>,

    private eventEmitter: EventEmitter2,

    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: ['transportPackage-created','package-created'],
    queue: 'transport',
  })
  public async changeItemStockBasedOnOrder(event: RabbitMQEvent) {
    console.log('IN THE TRANSPORT PACKAGE CREATED HANDLER');
    console.log(event);
    this.eventEmitter.emit(
      event['pattern'],
      event['payload']
    );
  }

  async createTransportCompany(transport: TransportCompany): Promise<TransportCompany> {
    const newTransport = new this.transportWriteModel(transport);
    return newTransport.save();
  }

  async getTransportCompanies(): Promise<TransportCompany[]> {
    return this.transportReadModel.find().exec();
  }

  async savePackage(packageToSave: Package): Promise<Package> {
    const newPackage = new this.packageWriteModel(packageToSave);
    this.amqpConnection.publish<any>(      
      'BALLpuntcom',
      'transportPackage-created',
      {pattern: 'transportPackage-created', payload: newPackage}
    );
    return newPackage.save();
  }

  @OnEvent('transportPackage-created')
  public async savePackageInRead(msg: any) : Promise<Package>{
    console.log('IN THE savePackageInRead HANDLER');
    console.log(msg);
    const newPackage = new this.packageReadModel(msg);
    return newPackage.save();
  }

  @OnEvent('package-created')
  public async packageCreatedHandler(msg: any) {
    console.log('IN THE packageCreatedHandler HANDLER');
    try {
      const givenPackage: Package = msg.package;
      // Retrieve transport companies from the database  
      const cheapestCompanyAndPrice = await this.findCheapestTransportCompany(givenPackage) ;
      givenPackage.TransportCompany = cheapestCompanyAndPrice[0];
      
      givenPackage.EstimatedDeliveryDate = msg.order.deliveryDate;
      givenPackage.Customer = msg.order.customer.name;
      
      givenPackage.TransportPrice = cheapestCompanyAndPrice[1];
    
      //save the package to the database
      this.savePackage(givenPackage);
    } catch (error) {
      console.error('Error processing package creation:', error);
    }
  }
  
  private async findCheapestTransportCompany(givenPackage: Package): Promise<[TransportCompany, number]> {
    let cheapestCompany: TransportCompany | undefined;
    let cheapestPrice: number | undefined;
    const transportCompanies: TransportCompany[] = await this.transportWriteModel.find();

    for (const company of transportCompanies) {
      let price: number;
  
      if (givenPackage.Size == 'S') {
        price = company.PriceSmallPackage;
      } else if (givenPackage.Size == 'M') {
        price = company.PriceMediumPackage;
      } else {
        price = company.PriceLargePackage;
      }

      price += givenPackage.WeightInKg * company.PricePerKg;
      if (cheapestPrice === undefined || price < cheapestPrice) {
        cheapestPrice = price;
        cheapestCompany = company;
      }
    }
    return [cheapestCompany, cheapestPrice];
  }
}
