import {IsArray, IsInt, IsNotEmpty, IsString, IsUrl} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ProductDto {

    @ApiProperty({
        example: "Tavuk şiş",
        description:'ürün adı'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example:'300',
        description:'Ürün fiyatı'
    })
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        example:'Sıcak ve lezzetli',
        description:'Ürün açıklaması'
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        example:"https://pbs.twimg.com/media/FNQqZxEXwAAC-NO?format=jpg&name=medium",
        description:"ürün url'si"
    })
    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;

    @ApiProperty({
        example:2,
        description:"Ürünün Restorant id'si"
    })
    @IsInt()
    restaurantId: number;
}