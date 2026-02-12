import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CartEntity} from "../entities/cart.entity";
import {CartService} from "./cart.service";
import {CartController} from "./cart.controller";
import {Cart_itemEntity} from "../entities/cart_item.entity";
import {ProductModule} from "../product/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([CartEntity, Cart_itemEntity]), ProductModule,],
    exports: [CartService],
    providers: [CartService],
    controllers: [CartController],
})
export class CartModule {
}
