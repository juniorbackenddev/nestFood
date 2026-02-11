import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";
import {OrderEntity} from "./order.entity";


@Entity()
export class Order_itemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column()
    priceAtTime: number;

    @ManyToOne(() => ProductEntity, (product) => product.order_item)
    @JoinColumn({ name: "product_id" })
    product: ProductEntity;

    @ManyToOne(() => OrderEntity, (order) => order.order_item)
    @JoinColumn({ name: "order_id" })
    order: OrderEntity;


}