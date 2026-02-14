import {IsArray, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CartItemDto {

    @ApiProperty({
        example: 1,
        description: "Ürün id'si",
    })
     @IsNotEmpty()
    @IsNumber()
    productId: number;

    @ApiProperty({
        example: 5,
        description:'ürün miktarı'
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty({
        example: [1,2],
        description:'Yan ürünlerin id leri'
    })
    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    optionIds?: number[];
}