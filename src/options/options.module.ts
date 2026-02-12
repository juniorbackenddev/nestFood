import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OptionEntity} from "../entities/option.entity";
import {ProductModule} from "../product/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([OptionEntity]), ProductModule],
  providers: [OptionsService],
  controllers: [OptionsController]
})
export class OptionsModule {}
