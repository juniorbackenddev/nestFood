import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {UsersService} from "../users.service";
import type { Request } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET as string
        })
    }

    async validate(payload: any) {
        const userId = payload.id;
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}
