import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {RolesGuard} from "../roles/roles.guard";
import {CategoryDto} from "../dtos/category.dto";
import {Roles} from "../roles/roles.decorator";
import {CategoriesEntity} from "../entities/categories.entity";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('ADMIN')
    @Post()
    async category(
        @Body() categoryDto: CategoryDto) {
        return await this.categoriesService.createCategories(categoryDto)
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('ADMIN')
    @Get()
    async getcategories(){
     return await this.categoriesService.findCategories();
    }
}
