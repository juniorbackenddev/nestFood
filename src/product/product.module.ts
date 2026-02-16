import {forwardRef, Module} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {RestaurantModule} from "../restaurant/restaurant.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "../entities/product.entity";
import {OptionsModule} from "../options/options.module";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity]),RestaurantModule,forwardRef(() => OptionsModule)],
    exports: [ProductService],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
