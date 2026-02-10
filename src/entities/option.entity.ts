import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class OptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    priceModifier: number;
}

