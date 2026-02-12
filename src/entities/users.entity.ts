import {
    Column,
    CreateDateColumn,
    Entity, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Exclude} from 'class-transformer';
import {AddressEntity} from "./address.entity";
import {CartEntity} from "./cart.entity";
import {OrderEntity} from "./order.entity";


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

    @OneToMany(() => AddressEntity, (address) => address.user)
    address: AddressEntity[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    order: OrderEntity[];

    @OneToOne(() => CartEntity, (cart) => cart.user)
    cart: CartEntity[];

}