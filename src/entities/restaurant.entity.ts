import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}