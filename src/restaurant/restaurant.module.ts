import {Module} from '@nestjs/common';
import {RestaurantService} from './restaurant.service';
import {RestaurantController} from './restaurant.controller';
import {CategoriesService} from "../categories/categories.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RestaurantEntity} from "../entities/restaurant.entity";
import {CategoriesModule} from "../categories/categories.module";

@Module({
    imports: [CategoriesModule,
        TypeOrmModule.forFeature([RestaurantEntity])],
    exports: [RestaurantService],
    providers: [RestaurantService],
    controllers: [RestaurantController]
})
export class RestaurantModule {
}
