import {IsNotEmpty, IsString, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";


export class LoginDto {

    @ApiProperty({
        example: 'email@gmail.com',
        description: 'kullanıcı email adresi',
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example:'GucluSifre123!',
        description:'Kullanıcı şifresi (En az 8 haneli)',
        minLength:8,
    })
    @IsNotEmpty()
    @MinLength(8)
    password: number;
}
