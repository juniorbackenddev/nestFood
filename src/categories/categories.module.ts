import {Module} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CategoriesController} from "./categories.controller";
import {CategoriesEntity} from "../entities/categories.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity]),],
    controllers: [CategoriesController],
    exports: [CategoriesService],
    providers: [CategoriesService],

})
export class CategoriesModule {
}
