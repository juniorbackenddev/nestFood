import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {RolesGuard} from "../roles/roles.guard";
import {CategoryDto} from "../dtos/category.dto";
import {Roles} from "../roles/roles.decorator";
import {CategoriesEntity} from "../entities/categories.entity";
import {ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: 'Yeni kategori oluşturur (Sadece Admin)'})

    @ApiResponse({
        status: 201,
        description: 'Kategori başarıyla oluşturuldu.'
    })
    @ApiResponse({
        status: 403,
        description: 'Erişim Engellendi. Bu işlemi yapmak için ADMIN yetkisi gerekir.'
    })
    @ApiResponse({
        status: 401,
        description: 'Yetkisiz. Token geçersiz veya yok.'
    })

    @ApiBody({type: CategoryDto})
    @Post()
    async category(
        @Body() categoryDto: CategoryDto) {
        return await this.categoriesService.createCategories(categoryDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({summary: 'Tüm kategorileri listeler'})

    @ApiResponse({
        status: 200,
        description: 'Kategoriler başarıyla listelendi.'
    })
    async getcategories() {
        return await this.categoriesService.findCategories();
    }
}
