import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../entities/product.entity";
import {In, Repository} from "typeorm";
import {ProductDto} from "../dtos/product.dto";
import {RestaurantService} from "../restaurant/restaurant.service";
import {OptionsService} from "../options/options.service";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly restaurantService: RestaurantService,
        @Inject(forwardRef(() => OptionsService))
        private readonly optionsService: OptionsService
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

        const foundOptions = await this.optionsService.getOptionsById(optionIds);

        if (foundOptions.length !== optionIds.length) {
            const foundIds = foundOptions.map(o => o.id);
            const missingIds = optionIds.filter(id => !foundIds.includes(id));

            throw new NotFoundException(`Şu ID'li opsiyonlar sistemde bulunamadı: ${missingIds.join(', ')}`);
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
