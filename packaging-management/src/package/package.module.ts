import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import configuration from 'config/configuration';
import { Package, PackageSchema } from './schemas/package.schema';
import { PackageService as PackageCompanyService } from './package.service';

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
