import {BadRequestException, Body, Controller, Param, Post, UseGuards} from '@nestjs/common';
import {ProductService} from "./product.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {ProductDto} from "../dtos/product.dto";
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    @ApiOperation({ summary: 'Yeni bir ürün oluşturur (Sadece Admin)' })

    @ApiResponse({
        status: 201,
        description: 'Ürün başarıyla oluşturuldu.'
    })
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Eksik veri.'
    })
    @ApiResponse({
        status: 403,
        description: 'Erişim Engellendi. Yetkisiz erişim.'
    })
    @ApiBody({ type: ProductDto })
    async takeProduct(
        @Body() productDto: ProductDto) {
        return await this.productService.takeProduct(productDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':id/options')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Ürüne seçenek (varyasyon) ekler' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Seçenek eklenecek ürünün ID\'si',
        example: 10
    })

    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                optionIds: {
                    type: 'array',
                    items: { type: 'integer' },
                    example: [1,2,5]
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Seçenekler başarıyla ürüne bağlandı.'
    })
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. "optionIds" bir dizi (array) olmalıdır.'
    })
    @ApiResponse({
        status: 401,
        description: 'Yetkisiz. Token yok veya geçersiz.'
    })
    @ApiResponse({
        status: 403,
        description: 'Erişim Engellendi. Sadece ADMIN yetkisi gerekir.'
    })
    @ApiResponse({
        status: 404,
        description: 'Verilen ID ile ürün bulunamadı.'
    })
    async addOptionsToProduct(
        @Param('id') productId: number,
        @Body('optionIds') optionIds: number[]
    ) {
        if (!Array.isArray(optionIds)) {
            throw new BadRequestException("optionIds bir dizi olmalıdır!");
        }
        return await this.productService.addOptionsToProduct(productId, optionIds);
    }
}
