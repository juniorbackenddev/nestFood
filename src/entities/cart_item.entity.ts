import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "./users.entity";
import {CartEntity} from "./cart.entity";
import {ProductEntity} from "./product.entity";
import {OptionEntity} from "./option.entity";

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

    @ManyToMany(() => OptionEntity, (option) => option.cart_item)
    @JoinTable({
        name: 'cart_item_option',
        joinColumn: {name: 'cart_itemId', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'optionId', referencedColumnName: 'id'},
    })
    option: OptionEntity[];


}