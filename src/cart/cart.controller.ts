import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {CartService} from "./cart.service";
import {CartItemDto} from "../dtos/cart_item.dto";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";


@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createCart(
        @Req() req,
        @Body() cart_itemDto:CartItemDto) {
        const userId =req.user.id;
        return await this.cartService.addToCart(userId, cart_itemDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getCart(@Req() req) {
        return await this.cartService.getCart(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('item/:id')
    async deleteCart(
        @Req() req,
        @Param('id')itemId: number) {
        const userId =req.user.id;
        return await this.cartService.removeItem(itemId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteAllCart(@Req() req, @Param('id') id: number) {
        const userId =req.user.id;
        return await this.cartService.removeAllCartItems(userId)
    }

}
