import {IsArray, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class RestaurantDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @IsNotEmpty()
    @IsInt()
    minCartPrice: number;

    @IsArray()
    @IsInt()
    categoryId: number[];
}

