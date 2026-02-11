import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CategoriesEntity} from "../entities/categories.entity";
import {CategoryDto} from "../dtos/category.dto";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoriesEntity)
        private readonly categoriesRepository: Repository<CategoriesEntity>,
    ) {
    }

    async createCategories(categoryDto: CategoryDto) {
        return await this.categoriesRepository.save({
            ...categoryDto,
        })
    }

    async findCategories()  {
        const category = await this.categoriesRepository.find();
        if (!category) {
            throw new NotFoundException(`Kategoriler bulunamadı`);
        }
        return category;
    }


    async findCategoriesById(id: number)  {
        const category = await this.categoriesRepository.findOneBy({id});
        if (!category) {
            throw new NotFoundException(`Kategori bulunamadı`);
        }
        return category;
    }


}
