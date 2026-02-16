import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import {RestaurantService} from "./restaurant.service";
import {RolesGuard} from "../roles/roles.guard";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {RestaurantEntity} from "../entities/restaurant.entity";
import {RestaurantDto} from "../dtos/restaurant.dto";
import {Roles} from "../roles/roles.decorator";
import {ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse} from "@nestjs/swagger";


@ApiBearerAuth('accessToken')
@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    @ApiOperation({ summary: 'Yeni bir restoran oluşturur (Sadece Admin)' })

    @ApiResponse({
        status: 201,
        description: 'Restoran başarıyla oluşturuldu.'
    })
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Eksik veri.'
    })
    @ApiResponse({
        status: 403,
        description: 'Erişim Engellendi. Sadece ADMIN yetkisi olanlar restoran ekleyebilir.'
    })
    async createRestaurant(
        @Body() restaurantDto: RestaurantDto
    ) {
        return await this.restaurantService.createRestaurant(restaurantDto);
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Tüm restoranları listeler (Kategoriye göre filtelenebilir)' })

    @ApiQuery({
        name: 'categoryId',
        required: false,
        description: 'Belirli bir kategoriye ait restoranları getirmek için ID girin.',
        example: 5
    })

    @ApiResponse({
        status: 200,
        description: 'Restoranlar listelendi.'
    })
    async getAllRestaurants(
        @Query('categoryId') categoryId?: number
    ) {
        return this.restaurantService.getRestaurants(categoryId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    @ApiOperation({ summary: 'ID ile detaylı restoran bilgisini getirir' })

    @ApiParam({
        name: 'id',
        description: 'Restoran ID',
        example: 1
    })
    @ApiResponse({
        status: 200,
        description: 'Restoran detayları başarıyla getirildi.'
    })
    @ApiResponse({
        status: 404,
        description: 'Belirtilen ID ile restoran bulunamadı.'
    })
    async getRestaurant(@Param('id') id: number) {
        return this.restaurantService.getRestaurantById(id);
    }
}
