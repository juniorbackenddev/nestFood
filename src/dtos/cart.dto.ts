import {IsInt, IsNotEmpty, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CartDto {

    @ApiProperty({
        example:'560',
        description:'Sepette bulunan tüm ürünlerin ve ürün kalemlerin toplam fiyatı'
    })
    @IsNotEmpty()
    @IsInt()
    totalPrice: number;

}