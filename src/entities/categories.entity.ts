import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {RestaurantEntity} from "./restaurant.entity";

@Entity()
export class CategoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => RestaurantEntity, (restaurant) => restaurant.categories )
    @JoinTable({
        name: 'restaurant_categories',
        joinColumn: { name: 'categoriesId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'restaurantId', referencedColumnName: 'id' },
    })
    restaurant: RestaurantEntity[];
}