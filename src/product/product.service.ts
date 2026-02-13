import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
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

    async addOptionsToProduct(productId: number, optionIds: number[]) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['option']
        });

        if (!product) {
            throw new NotFoundException(`ID'si ${productId} olan ürün bulunamadı.`);
        }

        const existingIds = product.option.map((option) => option.id);

        const duplicate = optionIds.filter(id => existingIds.includes(id));

        if (duplicate.length > 0) {
            throw new BadRequestException(`Bu ID'li opsiyonlar (${duplicate.join(',')}) zaten eklenmiş.`);
        }
        const newOptions = optionIds.map(id => ({ id } as any));

        product.option = [...product.option, ...newOptions];

        return await this.productRepository.save(product);
    }

    async getProductById(productId: number) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ["option","restaurant"]
        });
        if(!product) {
            throw new NotFoundException('Böyle bir Product bulunamadı.')
        }
        if(product) {
            return product;
        }
    }


}
