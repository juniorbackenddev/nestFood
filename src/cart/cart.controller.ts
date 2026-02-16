import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards} from '@nestjs/common';
import {CartService} from "./cart.service";
import {CartItemDto} from "../dtos/cart_item.dto";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";

@ApiBearerAuth('accessToken')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Sepete yeni ürün ekler veya miktarı günceller' })
    @ApiResponse({
        status: 201,
        description: 'Ürün başarıyla sepete eklendi.'
    })
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Ürün ID veya miktar geçersiz.'
    })
    @ApiBody({ type: CartItemDto })
    async createCart(
        @Req() req,
        @Body() cart_itemDto:CartItemDto) {
        const userId =req.user.id;
        return await this.cartService.addToCart(userId, cart_itemDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Kullanıcının güncel sepetini getirir' })
    @ApiResponse({
        status: 200,
        description: 'Sepet içeriği başarıyla getirildi.'
    })
    async getCart(@Req() req) {
        return await this.cartService.getCart(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('item/:id')
    @ApiOperation({ summary: 'Sepetten belirli bir ürünü siler' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Silinecek sepet kaleminin id\'si (CartItem ID)',
        example: 15
    })
    @ApiResponse({
        status: 200,
        description: 'Ürün sepetten kaldırıldı.'
    })
    @ApiResponse({
        status: 404,
        description: 'Belirtilen ürün sepette bulunamadı.'
    })
    async deleteCart(
        @Req() req,
        @Param('id', ParseIntPipe) itemId: number ) {
        const userId =req.user.id;
        return await this.cartService.removeItem(itemId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    @ApiOperation({ summary: 'Sepeti tamamen temizler (Tüm ürünleri siler)' })
    @ApiResponse({
        status: 200,
        description: 'Sepet başarıyla boşaltıldı.'
    })
    async deleteAllCart(@Req() req) {
        const userId =req.user.id;
        return await this.cartService.removeAllCartItems(userId)
    }
}
