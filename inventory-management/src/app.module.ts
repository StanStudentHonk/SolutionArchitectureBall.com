import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './item/item.module';
import { WarehouseModule } from './warehouse/warehouse.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ItemModule,
    WarehouseModule
  ],
})
export class AppModule {}
