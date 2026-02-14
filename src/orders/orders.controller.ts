import {Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {OrdersService} from "./orders.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Mevcut sepeti onaylar ve siparişe dönüştürür (Checkout)' })

    @ApiResponse({
        status: 201,
        description: 'Sipariş başarıyla oluşturuldu.'
    })
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Sepet boş olabilir veya stok yetersiz.'
    })
    @ApiResponse({
        status: 401,
        description: 'Yetkisiz. Giriş yapılmamış.'
    })
    async createOrder(@Req() req) {
        const userId = req.user.id
        return await this.ordersService.createOrder(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Kullanıcının tüm geçmiş siparişlerini listeler' })

    @ApiResponse({
        status: 200,
        description: 'Sipariş geçmişi başarıyla getirildi.'
    })
    @ApiResponse({
        status: 401,
        description: 'Yetkisiz. Token geçersiz.'
    })
    async getAllOrders(
        @Req() req) {
        const userId = req.user.id;
        return await this.ordersService.getOrdersByUserId(userId);
    }
}
