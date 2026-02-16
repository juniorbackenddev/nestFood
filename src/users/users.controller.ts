import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {AddressDto} from "../dtos/address.dto";
import {JwtAuthGuard} from "./jwt-auth-guard/jwt-auth-guard.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RegisterDto} from "../dtos/register.dto";

@ApiTags('users') // Bunu eklemek swagger'da düzenli görünmesini sağlar
@ApiBearerAuth('accessToken')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('address')
    @ApiOperation({summary: 'Kullanıcı addressi oluşturldu.'})
    @ApiResponse({status: 201, description: 'Kullanıcı addresi oluşturuldu.'})
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Eksik veri veya yanlış format (Örn: Posta kodu girilmedi).'
    })
    @ApiBody({type: AddressDto})
    async createAddress(
        @Body() addressDto: AddressDto,
        @Req() req,
    ) {
        const userId = req.user.id;
        return await this.usersService.createAddress(addressDto, userId);
    }
}
