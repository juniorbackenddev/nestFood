import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";

@Entity()
export class OptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    priceModifier: number;

    @ManyToMany(() => ProductEntity, (product) => product.option)
    product: ProductEntity;
}

