import {IsNotEmpty, IsString} from 'class-validator';
import {LoginDto} from "./login.dto";
import {ApiProperty} from "@nestjs/swagger";


export class RegisterDto extends LoginDto {

    @ApiProperty({
        example: 'Muhammet Yasin Altay',
        description: 'kullanıcının adı soyadı.',
    })
    @IsNotEmpty()
    @IsString()
    fullName: string;
}