import {Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {OrdersService} from "./orders.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createOrder(@Req() req) {
        const userId = req.user.id
        return await this.ordersService.createOrder(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllOrders(
        @Req() req) {
        const userId = req.user.id;
        return await this.ordersService.getOrdersByUserId(userId);
    }
}
