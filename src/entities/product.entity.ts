import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}