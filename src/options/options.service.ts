import {Injectable} from '@nestjs/common';
import {ProductService} from "../product/product.service";
import {OptionDto} from "../dtos/option.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {OptionEntity} from "../entities/option.entity";

@Injectable()
export class OptionsService {
    constructor(
        @InjectRepository(OptionEntity)
        private optionRepository: Repository<OptionEntity>,
        private productService: ProductService) {
    }


    async createOption(optionDto: OptionDto) {
        //const product = optionDto.productId.map(id => ({id}));
        return await this.optionRepository.save({
            //product: product,
            ...optionDto
        });
    }
/*
    async getOptionsById(optionIds: number[]) {
        const options = await this.optionRepository.find({
            where: {id:In(optionIds)},
            select: ["id", "name", "priceModifier"]
        });
        return options;
    }*/
}
