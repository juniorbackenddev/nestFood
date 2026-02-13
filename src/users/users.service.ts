import {BadRequestException, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";
import {JwtService} from '@nestjs/jwt';
import {RegisterDto} from "../dtos/register.dto";
import * as bcrypt from 'bcrypt';
import {RefreshDto} from "../dtos/refresh.dto";
import {LoginDto} from "../dtos/login.dto";
import {AddressEntity} from "../entities/address.entity";
import {AddressDto} from "../dtos/address.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly authRepository: Repository<UsersEntity>,
        @InjectRepository(AddressEntity)
        private readonly addressRepository:Repository<AddressEntity>,
        private readonly jwtService: JwtService,
    ) {
    }

    generateToken(user: UsersEntity) {
        const accessToken: string = this.jwtService.sign(
            {
                id: user.id,
                role: user.role,
                expiresIn: '15m',
            },
            {}
        );
        const refreshToken: string = this.jwtService.sign(
            {
                id: user.id,
                type: 'refresh',
                expiresIn: '15d',
            },
            {}
        );
        return {accessToken, refreshToken};
    }

    async login(loginDto: LoginDto) {
        const user = await this.authRepository.findOne({
            where: {email: loginDto.email},
        });
        if (!user) {
            throw new BadRequestException("Kullanıcı adı veya şifre yanlış.");
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException("Kullanıcı adı veya şifre yanlış");
        }
        const token = this.generateToken(user)
        const hashedRefresh: string = await bcrypt.hash(token.refreshToken, 10);

        await this.authRepository.update(user.id, {
            refreshToken: hashedRefresh,
        });

        return {msg: 'Hoşgeldin', token: token};
    }


    async createUser(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = await this.authRepository.create({
            fullName: registerDto.fullName,
            email: registerDto.email,
            password: hashedPassword,
            role: 'CUSTOMER'
        });

        const user = await this.authRepository.findOne({
            where: {email: registerDto.email},
        });

        if (user) {
            throw new BadRequestException("Bu email zaten kullanımda");
        }

        const savedUser = await this.authRepository.save(newUser);

        const tokens = this.generateToken(savedUser);
        const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

        await this.authRepository.update(savedUser.id, {
            refreshToken: hashedRefresh,
        });

        return {
            msg: 'Kayıt başarılı.',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async refreshToken(rtoken: RefreshDto) {
        try {
            const payload = await this.jwtService.verifyAsync(rtoken.refreshToken);

            const user = await this.authRepository.findOne({
                where: {id: payload.id},
            });

            if (!user) {
                throw new BadRequestException('Erişim reddedildi (User yok)')
            }
            const isMatch = await bcrypt.compare(rtoken.refreshToken, user.refreshToken);
            if (!isMatch) {
                throw new BadRequestException('Refresh token geçersiz');
            }
            const newTokens = this.generateToken(user);
            const newHashedRefresh = await bcrypt.hash(newTokens.refreshToken, 10);

            await this.authRepository.update(user.id, {
                refreshToken: newHashedRefresh,
            });

            return newTokens;

        } catch (e) {
            throw new BadRequestException('Geçersiz Refresh Token');
        }
    }


    async findUserById(id: number) {
        const existingUser = await this.authRepository.findOne({
            where: {id: id},
            select: ['id', 'email', 'role', 'createdAt']
        });
        if (existingUser) {
            console.log('existingUser', existingUser);
            return existingUser;
        }
    }

    async createAddress(addressDto: AddressDto,userId: number) {
        const address = await this.addressRepository.create({
            ...addressDto,
            user: { id: userId }
        });
        return await this.addressRepository.save(address);
    }
}
