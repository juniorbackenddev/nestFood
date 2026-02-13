import {Module} from '@nestjs/common';
import {UsersService} from "./users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt-strategy/jwt-strategy.service";
import {UsersController} from "./users.controller";
import {JwtAuthGuard} from "./jwt-auth-guard/jwt-auth-guard.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AddressEntity} from "../entities/address.entity";


@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '30d',
                },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UsersEntity,AddressEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [UsersService, JwtStrategy, JwtAuthGuard],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {
}
