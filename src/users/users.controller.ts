import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {AddressDto} from "../dtos/address.dto";
import {JwtAuthGuard} from "./jwt-auth-guard/jwt-auth-guard.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService) {}


    @UseGuards(JwtAuthGuard)
    @Post('address')
    async createAddress(
        @Body() addressDto:AddressDto,
        @Req() req,
    ) {
        const userId = req.user.id;
        return await this.usersService.createAddress(addressDto,userId);
    }

}
