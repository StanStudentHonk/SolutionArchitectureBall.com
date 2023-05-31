import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Package } from './schemas/package.schema';
import { PackageService } from './package.service';
import { Order } from './schemas/order.schema';

@Controller('package')
export class PackageController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly packageService: PackageService) {}
  
  @Get() 
  async getPackages() {
    // Add to the mongoDB
    const packages = await this.packageService.getPackages();
    // Publish the package to the exchange
    return packages;
  }
}