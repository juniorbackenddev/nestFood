import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../entities/product.entity";
import {Repository} from "typeorm";
import {ProductDto} from "../dtos/product.dto";
import {RestaurantService} from "../restaurant/restaurant.service";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly restaurantService: RestaurantService,
    ) {
    }

    async takeProduct(productDto: ProductDto) {
        const restaurant = await this.restaurantService.getRestaurantById(productDto.restaurantId)

        if (!restaurant) {
            throw new NotFoundException("Restoran bulunamadı.");
        }
        const product = this.productRepository.create({
            ...productDto,
            restaurant: restaurant
        });
        return await this.productRepository.save(product);
    }
}
