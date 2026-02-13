import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";
import {Cart_itemEntity} from "./cart_item.entity";
import {OrderEntity} from "./order.entity";
import {Order_itemEntity} from "./order_item.entity";

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

    @ManyToMany(() => Cart_itemEntity, (cart_item) => cart_item.option)
    cart_item: Cart_itemEntity[];

    @ManyToMany(() => Order_itemEntity, (order_item) => order_item.option)
    order_item: Order_itemEntity[];
}

