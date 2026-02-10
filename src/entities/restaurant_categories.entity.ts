import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Restaurant_categoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

}