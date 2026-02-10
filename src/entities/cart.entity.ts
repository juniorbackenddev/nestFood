import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalPrice: number;
}