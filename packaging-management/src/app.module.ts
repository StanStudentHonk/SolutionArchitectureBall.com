
import { ConfigModule } from '@nestjs/config';


import { Module } from '@nestjs/common';
import { PackageController } from './package/package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import configuration from 'config/configuration';
import { Package, PackageSchema } from './package/schemas/package.schema';
import { PackageService as PackageCompanyService } from './package/package.service';
'../config/configuration';

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
      connectionName: 'packages-read',
    }),
    MongooseModule.forRoot(configuration.mongodb.write, {
      connectionName: 'packages-write',
    }),
    MongooseModule.forFeature(
      [{ name: Package.name, schema: PackageSchema }],
      'packages-read',
    ),
    MongooseModule.forFeature(
      [{ name: Package.name, schema: PackageSchema }],
      'packages-write',
    ),
  ],
  controllers: [PackageController],
  providers: [PackageCompanyService],
})

export class PackageModule {}

@Module({
  imports: [
    ConfigModule.forRoot(
    ),
    PackageModule
  ],
})
export class AppModule {}
