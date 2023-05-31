import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransportCompany } from './schemas/transportCompany.schema';
import { Console } from 'console';
import { Package } from './schemas/package.schema';

@Injectable()
export class TransportCompanyService {
  constructor(
    @InjectModel(TransportCompany.name, 'transports-read')
    private readonly transportReadModel: Model<TransportCompany>,

    @InjectModel(TransportCompany.name, 'transports-write')
    private readonly transportWriteModel: Model<TransportCompany>,
  ) {}

  async createTransportCompany(transport: TransportCompany): Promise<TransportCompany> {
    const newTransport = new this.transportWriteModel(transport);
    return newTransport.save();
  }

  async getTransportCompanies(): Promise<TransportCompany[]> {
    return this.transportReadModel.find().exec();
  }

  /*@RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: 'transportCompany-created',
    queue: 'transport',
  })
  public async transportCompanyCreatedHandler(msg: {}) {
    const newTransport = new this.transportReadModel(msg);
    newTransport.save();
  }*/

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: 'package-created',
    queue: 'transport',
  })
  public async packageCreatedHandler(msg: string) {
    console.log('IN THE PACKAGE CREATED HANDLER');
    console.log('Package created:', msg);
    try {
      const givenPackage: Package = JSON.parse(msg);
      // Retrieve transport companies from the database  
      const cheapestCompany = await this.findCheapestTransportCompany(givenPackage);
      givenPackage.TransportCompany = cheapestCompany;
      this.transportWriteModel.create(givenPackage);
      console.log('Cheapest Transport Company:', cheapestCompany?.name);
  
      // Perform further actions with the cheapest transport company
      return givenPackage;
    } catch (error) {
      console.error('Error processing package creation:', error);
    }
  }
  
  private async findCheapestTransportCompany(givenPackage: Package): Promise<TransportCompany> {
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
  
    return cheapestCompany;
  }

 
}
