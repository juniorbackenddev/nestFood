import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Cart_itemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;
}