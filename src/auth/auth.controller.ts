import {Body, Controller, Post, Res, UsePipes} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {RegisterDto} from "../dtos/register.dto";
import type {Response} from 'express';
import {LoginDto} from "../dtos/login.dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: UsersService) {
    }

    @Post('login')
    async login(
        @Body() login: LoginDto,
        @Res({passthrough: true}) response: Response,
    ) {
        const loginn = await this.authService.login(login);
        return loginn;
    }

    @Post('register')
    async register(
        @Body() register: RegisterDto
    ) {
        return await this.authService.createUser(register);
    }
}
