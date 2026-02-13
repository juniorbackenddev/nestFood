import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderEntity} from "../entities/order.entity";
import {CartEntity} from "../entities/cart.entity";
import {Cart_itemEntity} from "../entities/cart_item.entity";
import {ProductModule} from "../product/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity])],
    exports: [OrdersService],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
