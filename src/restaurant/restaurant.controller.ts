import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import {RestaurantService} from "./restaurant.service";
import {RolesGuard} from "../roles/roles.guard";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {RestaurantEntity} from "../entities/restaurant.entity";
import {RestaurantDto} from "../dtos/restaurant.dto";

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createRestaurant(
        @Body() restaurantDto: RestaurantDto
    ) {
        return await this.restaurantService.createRestaurant(restaurantDto);
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllRestaurants(
        @Query('categoryId') categoryId?: number
    ) {
        return this.restaurantService.getRestaurants(categoryId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getRestaurant(@Param('id') id: number) {
        return this.restaurantService.getRestaurantById(id);
    }
}
