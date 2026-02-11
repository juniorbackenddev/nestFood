import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "./users.entity";
import {CartEntity} from "./cart.entity";
import {ProductEntity} from "./product.entity";

@Entity()
export class Cart_itemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => CartEntity, (cart) => cart.cart_item)
    @JoinColumn({name: "cart_id"})
    cart: CartEntity;

    @ManyToOne(() => ProductEntity, (product) => product.cart_item)
    @JoinColumn({name: "product_id"})
    product: ProductEntity;
}