import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RestaurantDto} from "../dtos/restaurant.dto";
import {In, Repository} from "typeorm";
import {RestaurantEntity} from "../entities/restaurant.entity";
import {CategoriesService} from "../categories/categories.service";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(RestaurantEntity)
        private readonly restaurantRepository: Repository<RestaurantEntity>,
        private readonly categoriesService: CategoriesService
    ) {
    }

    async createRestaurant(restaurantDto: RestaurantDto) {
        // 1. DTO'daki her bir ID için servisteki findOneBy metodunu çağırıyoruz
        // Promise.all, tüm kategorilerin veritabanından getirilmesini bekler.
        const categories = await Promise.all(
            restaurantDto.categoryId.map(id =>
                this.categoriesService.findCategoriesById(id)
            )
        );
        const restaurant = this.restaurantRepository.create({
            ...restaurantDto,
            categories: categories
        });

        return await this.restaurantRepository.save(restaurant);
    }

    async getRestaurants(categoryId?: number) {
        const querycondition: any = {};

        if (categoryId) {
            querycondition.categories = {
                id: categoryId
            };
        }
        const restaurant = await this.restaurantRepository.find({
            where: querycondition,
            relations: ['categories']
        });
        if (!restaurant || restaurant.length === 0) {
            throw new NotFoundException(`Kategoriye ait Restaurant bulunamadı.`);
        }
        return restaurant;
    }

    async getRestaurantById(id: number) {
        const restaurant = await this.restaurantRepository.findOne({
            where: {id: id},
            relations: ['categories']
        });
        if (!restaurant) {
            throw new NotFoundException(`Restaurant bulunamadı.`);
        }
        if (restaurant) {
            console.log(restaurant);
            return restaurant;
        }
    }
}
