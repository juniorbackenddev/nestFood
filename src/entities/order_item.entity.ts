import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";
import {OrderEntity} from "./order.entity";
import {OptionEntity} from "./option.entity";


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

    @ManyToMany(() => OptionEntity, (option) => option.order_item)
    @JoinTable({
        name: 'order_item_option',
        joinColumn: {name: 'order_itemId', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'optionId', referencedColumnName: 'id'},
    })
    option: OptionEntity[];


}