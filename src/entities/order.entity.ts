import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {OrderStatus} from "../enum/order.enum";
import {CartEntity} from "./cart.entity";
import {UsersEntity} from "./users.entity";
import {RestaurantEntity} from "./restaurant.entity";
import {Order_itemEntity} from "./order_item.entity";
import {OptionEntity} from "./option.entity";

@Entity()
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    finalPrice: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @ManyToOne(() => UsersEntity, (user) => user.order)
    user: UsersEntity;

    @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.order)
    @JoinColumn({name: "restaurant_id"})
    restaurant: RestaurantEntity;

    @OneToMany(() => Order_itemEntity, (order_item) => order_item.order)
    order_item: Order_itemEntity[];

    @CreateDateColumn()
    createdAt: Date;
}