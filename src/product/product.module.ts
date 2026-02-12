import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {RestaurantModule} from "../restaurant/restaurant.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "../entities/product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity]),RestaurantModule],
    exports: [ProductService],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
