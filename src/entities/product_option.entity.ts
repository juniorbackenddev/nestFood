import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product_optionEntity {
    @PrimaryGeneratedColumn()
    id: number;
}