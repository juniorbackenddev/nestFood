import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Order_itemEntity} from "./order_item.entity";
import {CartEntity} from "./cart.entity";
import {Cart_itemEntity} from "./cart_item.entity";
import {RestaurantEntity} from "./restaurant.entity";
import {OptionEntity} from "./option.entity";

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    imageUrL: string;

    @ManyToMany(() => OptionEntity, (option) => option.product)
    @JoinTable({
        name: 'product_option',
        joinColumn: {name: 'productId', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'optionId', referencedColumnName: 'id'},
    })
    option: OptionEntity[];

    @OneToMany(() => Order_itemEntity, (order_item) => order_item.product)
    order_item: Order_itemEntity[];

    @OneToMany(() => Cart_itemEntity, (cart_item) => cart_item.product)
    cart_item: Cart_itemEntity[];

    @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.product)
    @JoinColumn({name: "restaurant_id"})
    restaurant: RestaurantEntity[];
}