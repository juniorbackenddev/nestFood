import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersService} from './users/users.service';
import {UsersController} from './users/users.controller';
import {UsersModule} from './users/users.module';
import {JwtStrategy} from './users/jwt-strategy/jwt-strategy.service';
import {AuthController} from './auth/auth.controller';
import {AuthModule} from './auth/auth.module';
import {UsersEntity} from "./entities/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {OrderEntity} from "./entities/order.entity";
import {Order_itemEntity} from "./entities/order_item.entity";
import {CartEntity} from "./entities/cart.entity";
import {Cart_itemEntity} from "./entities/cart_item.entity";
import {ProductEntity} from "./entities/product.entity";
import {AddressEntity} from "./entities/address.entity";
import {RestaurantEntity} from "./entities/restaurant.entity";
import {CategoriesEntity} from "./entities/categories.entity";
import {OptionEntity} from "./entities/option.entity";
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ProductModule } from './product/product.module';
import { OptionsModule } from './options/options.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'password',
            database: 'nest_food',
            entities: [UsersEntity, OrderEntity, Order_itemEntity, Cart_itemEntity,CartEntity, ProductEntity, AddressEntity, RestaurantEntity, CategoriesEntity, OptionEntity],
            synchronize: true,
        }),
        UsersModule, AuthModule, CategoriesModule, RestaurantModule, ProductModule, OptionsModule, CartModule, OrderModule, OrdersModule
    ],
    controllers: [AppController, OrderController],
    providers: [AppService, JwtStrategy, OrderService],
})
export class AppModule {
}
