import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";
import {Cart_itemEntity} from "./cart_item.entity";

@Entity()
export class OptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceModifier: number;

    @ManyToMany(() => ProductEntity, (product) => product.option)
    product: ProductEntity[];

    @ManyToMany(() => Cart_itemEntity, (cartItem) => cartItem.selectedOptions)
    cartItems: Cart_itemEntity[];
}

