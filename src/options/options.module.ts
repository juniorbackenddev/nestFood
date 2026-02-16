import {forwardRef, Module} from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OptionEntity} from "../entities/option.entity";
import {ProductModule} from "../product/product.module";
import {ProductService} from "../product/product.service";

@Module({
    imports: [TypeOrmModule.forFeature([OptionEntity]), forwardRef(() => ProductModule)],
    exports: [OptionsService],
  providers: [OptionsService],
  controllers: [OptionsController]
})
export class OptionsModule {}
