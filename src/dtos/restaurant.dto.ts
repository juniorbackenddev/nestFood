import {IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RestaurantDto {

    @ApiProperty({
        example: 'Sultan Pide',
        description:'restaurant adı'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'Restauranta ait bir görsel urlsi',
        description:'https://pbs.twimg.com/media/FNQqZxEXwAAC-NO?format=jpg&name=medium'
    })
    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;

    @ApiProperty({
        example: 300,
        description:'Restaurantın minimum sepet tutarı'
    })
    @IsNotEmpty()
    @IsInt()
    minCartPrice: number;


    @ApiProperty({
        example: [3,5],
        description:'restaurantın ait olduğu category idleri'
    })
    @IsArray()
    @IsInt()
    categoryId: number[];
}

