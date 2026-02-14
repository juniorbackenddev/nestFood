import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CategoryDto {

    @ApiProperty({
        example: 'çorba',
        description:'Kategori ismi'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

}