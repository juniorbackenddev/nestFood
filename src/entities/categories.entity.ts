import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CategoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}