import {IsInt, IsNotEmpty, IsOptional} from "class-validator";

export class CartDto {
    @IsNotEmpty()
    @IsInt()
    totalPrice: number;

}