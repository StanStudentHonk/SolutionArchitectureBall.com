import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TransportCompany } from './schemas/transportCompany.schema';
import { TransportCompanyService } from './transportCompany.service';

@Controller('transport')
export class TransportCompanyController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly transportService: TransportCompanyService) {}
  
  @Post()
  async createTransportCompany(@Body() TransportCompanyData: TransportCompany) {
    // Add to the mongoDB
    const transportCompany = await this.transportService.createTransportCompany(TransportCompanyData);
    // Publish the TransportCompany to the exchange
    this.amqpConnection.publish<TransportCompany>('BALLpuntcom', 'transportCompany-created', transportCompany);
    return transportCompany;
  }

  @Get() 
  async getTransportCompanies() {
    // Add to the mongoDB
    const transports = await this.transportService.getTransportCompanies();

    // Publish the transport to the exchange
    return transports;
  }
}