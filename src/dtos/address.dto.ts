import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddressDto {
    @ApiProperty({
        example: 'Kyk erkek öğrenci yurdu',
        description: 'Adres Başlığı:Evse ev, yurtsa yurt şeklinde'
    })
    @IsNotEmpty()
    @IsString()
    title: string;


    @ApiProperty({
        example: 'İstanbul',
        description: 'Şehir'
    })
    @IsNotEmpty()
    @IsString()
    city: string;


    @ApiProperty({
        example: 'Fatih',
        description: 'İlçe'
    })
    @IsNotEmpty()
    @IsString()
    district: string;

    @ApiProperty({
        example: 'Yasin Mahallesi Yasin yokuşu, No:20 Fatih, İstanbul',
        description: 'Açık adress'
    })
    @IsNotEmpty()
    @IsString()
    openAddress: string;
}