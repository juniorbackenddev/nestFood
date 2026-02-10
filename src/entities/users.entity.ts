import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Exclude} from 'class-transformer';


@Entity()
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({
        type: 'enum',
        enum: ['CUSTOMER', 'ADMIN'],
        default: 'CUSTOMER',
    })
    role: string;

    @Column({nullable: true, select: false, unique: true})
    @Exclude()
    refreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

}