import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ProductService} from "./product.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {ProductDto} from "../dtos/product.dto";

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async takeProduct(
        @Body() productDto: ProductDto) {
        return await this.productService.takeProduct(productDto);
    }
}
