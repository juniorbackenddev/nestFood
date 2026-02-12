import {IsArray, IsInt, IsNotEmpty, IsNumber} from "class-validator";

export class OptionDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    priceModifier: number;

   /* @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    productId: number[];*/
}