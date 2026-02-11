import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "./users.entity";
import {OrderEntity} from "./order.entity";
import {Cart_itemEntity} from "./cart_item.entity";
import {ProductEntity} from "./product.entity";

@Entity()
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalPrice: number;

    @OneToMany(() => Cart_itemEntity, (cart_item) => cart_item.cart)
    cart_item: Cart_itemEntity[];

    @ManyToOne(() => UsersEntity, (user) => user.cart)
    @JoinColumn({name: "user_id"})
    user: UsersEntity;
}