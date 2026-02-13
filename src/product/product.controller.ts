import {Body, Controller, Param, Post, UseGuards} from '@nestjs/common';
import {ProductService} from "./product.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {ProductDto} from "../dtos/product.dto";
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    async takeProduct(
        @Body() productDto: ProductDto) {
        return await this.productService.takeProduct(productDto);
    }

    // product.controller.ts
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':id/options')
    @Roles('ADMIN')
    async addOptionsToProduct(
        @Param('id') productId: number,
        @Body('optionIds') optionIds: number[]
    ) {
        return await this.productService.addOptionsToProduct(productId, optionIds);
    }
}
