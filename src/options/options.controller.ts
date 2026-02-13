import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {OptionsService} from "./options.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";
import {OptionDto} from "../dtos/option.dto";
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";

@Controller('options')
export class OptionsController {
    constructor(
        private readonly optionsService: OptionsService) {}


    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('ADMIN')
    @Post()
    async createOption(
        @Body() optionDto:OptionDto) {
        return await this.optionsService.createOption(optionDto);
    }
}
