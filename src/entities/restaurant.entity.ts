import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";
import {OrderEntity} from "./order.entity";
import {CategoriesEntity} from "./categories.entity";

@Entity()
export class RestaurantEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    imageUrl: string;
    @Column()
    minCartPrice: number;

    @OneToMany(() => ProductEntity, (product) => product.restaurant)
    product: ProductEntity;

    @OneToMany(() => OrderEntity, (order) => order.restaurant)
    order: OrderEntity[];

    @ManyToMany(() => CategoriesEntity, (categories) => categories.restaurant)
    categories: CategoriesEntity[];

}