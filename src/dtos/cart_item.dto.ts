import {IsArray, IsNumber, IsOptional} from "class-validator";

export class CartItemDto {
    @IsNumber()
    productId: number;

    @IsNumber()
    quantity: number;

    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    optionIds: number[];
}