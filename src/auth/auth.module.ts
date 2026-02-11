import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "../users/jwt-strategy/jwt-strategy.service";
import {AuthController} from "./auth.controller";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";
import {JwtAuthGuard} from "../users/jwt-auth-guard/jwt-auth-guard.service";

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([UsersEntity]),
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
    ],
    providers: [JwtStrategy],
    exports: [JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {
}
