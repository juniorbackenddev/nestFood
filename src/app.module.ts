import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersService} from './users/users.service';
import {UsersController} from './users/users.controller';
import {UsersModule} from './users/users.module';
import {JwtStrategy} from './users/jwt-strategy/jwt-strategy.service';
import {AuthController} from './auth/auth.controller';
import {AuthModule} from './auth/auth.module';
import {UsersEntity} from "./entities/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'password',
            database: 'nest_food',
            entities: [UsersEntity],
            synchronize: true,
        }),
        UsersModule, AuthModule
    ],
    controllers: [AppController, AuthController],
    providers: [AppService, JwtStrategy],
})
export class AppModule {
}
