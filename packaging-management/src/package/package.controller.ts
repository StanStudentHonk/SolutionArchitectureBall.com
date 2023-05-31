import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Package } from './schemas/package.schema';
import { PackageService } from './package.service';

@Controller('package')
export class PackageController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly packageService: PackageService) {}
  
  @Post()
  async createPackage(@Body() PackageData: Package) {
    // Add to the mongoDB
    const createdPackage = await this.packageService.createPackage(PackageData);
    // Publish the Package to the exchange
    this.amqpConnection.publish<Package>('BALLpuntcom', 'package-created', createdPackage);
    return createdPackage;
  }

  @Get() 
  async getPackages() {
    // Add to the mongoDB
    const packages = await this.packageService.getPackages();
    // Publish the package to the exchange
    return packages;
  }
}