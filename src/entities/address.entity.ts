import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersEntity} from "./users.entity";

@Entity()
export class AddressEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

     @Column()
    title: string;

     @Column()
    city: string;

     @Column()
    district: string;

     @Column()
    openAddress: string;

    @ManyToOne(() => UsersEntity, (user) => user.address)
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;



}