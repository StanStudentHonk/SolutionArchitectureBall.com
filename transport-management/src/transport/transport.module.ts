import { Module } from '@nestjs/common';
import { TransportCompanyController } from './transport.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import configuration from 'config/configuration';
import { TransportCompany, TransportCompanySchema } from './schemas/transportCompany.schema';
import { TransportCompanyService as TransportCompanyService } from './transportCompany.service';
import { Package, PackageSchema } from './schemas/package.schema';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'BALLpuntcom',
          type: 'topic',
        },
      ],
      uri: configuration.rabbitmq.host,
    }),
    MongooseModule.forRoot(configuration.mongodb.read, {
      connectionName: 'transports-read',
    }),
    MongooseModule.forRoot(configuration.mongodb.write, {
      connectionName: 'transports-write',
    }),
    MongooseModule.forFeature(
      [{ name: TransportCompany.name, schema: TransportCompanySchema }],
      'transports-read',
    ),
    MongooseModule.forFeature(
      [{ name: TransportCompany.name, schema: TransportCompanySchema }],
      'transports-write',
    ),
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }], 'transports-read'),
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }], 'transports-write'),
  ],
  controllers: [TransportCompanyController],
  providers: [TransportCompanyService],
})
export class TransportModule {}
