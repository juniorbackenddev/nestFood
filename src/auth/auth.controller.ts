import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { RegisterDto } from "../dtos/register.dto";
import type { Response } from 'express';
import { LoginDto } from "../dtos/login.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: UsersService) {}


    @Post('login')
    @HttpCode(200) // Login başarılı ise 200 dönmesi standarttır
    @ApiOperation({ summary: 'Kullanıcı girişi yapar ve Token döner' })

    // --- BAŞARILI DURUM ---
    @ApiResponse({
        status: 200,
        description: 'Giriş başarılı. Access Token döndürüldü.'
    })
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Eksik veri veya yanlış format.'
    })
    @ApiResponse({
        status: 404,
        description: 'Kullanıcı adı veya şifre yanlış.'
    })

    @ApiBody({ type: LoginDto })
    async login(
        @Body() login: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        return await this.authService.login(login);
    }

    @Post('register')
    @ApiOperation({ summary: 'Yeni kullanıcı kaydı oluşturur' })

    @ApiResponse({
        status: 201,
        description: 'Kullanıcı başarıyla oluşturuldu.'
    })

    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Bu email zaten kullanımda veya şifre kurallara uymuyor.'
    })

    @ApiBody({ type: RegisterDto })
    async register(
        @Body() register: RegisterDto
    ) {
        return await this.authService.createUser(register);
    }
}