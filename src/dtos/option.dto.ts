import {IsArray, IsInt, IsNotEmpty, IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class OptionDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'Ekstra sos',
        description:'Yan ürün ismi'
    })
    name: string;


    @ApiProperty({
        example: '+30Tl',
        description:'Yan ürünün ekstra fiyatı'
    })
    @IsNotEmpty()
    priceModifier: number;

}