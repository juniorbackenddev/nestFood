import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {OptionsService} from "./options.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {OptionDto} from "../dtos/option.dto";
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";

@ApiBearerAuth('accessToken')
@Controller('options')
export class OptionsController {
    constructor(
        private readonly optionsService: OptionsService) {}


    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Yeni bir seçenek oluşturur (Örn: ekstra lavaş)' })

    @ApiResponse({
        status: 201,
        description: 'Seçenek başarıyla oluşturuldu.'
    })
    @ApiResponse({
        status: 400,
        description: 'Hatalı İstek. Eksik veri veya yanlış format.'
    })
    @ApiResponse({
        status: 401,
        description: 'Yetkisiz. Token geçersiz.'
    })
    @ApiResponse({
        status: 403,
        description: 'Erişim Engellendi. Sadece ADMIN yetkisi olanlar seçenek ekleyebilir.'
    })
    @ApiBody({ type: OptionDto })
    @Post()
    async createOption(
        @Body() optionDto:OptionDto) {
        return await this.optionsService.createOption(optionDto);
    }
}
