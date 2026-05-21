import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";

import { Users } from "~/modules/users/users.model";
import { Salons } from "~/modules/salons/salons.model";

@Entity("addresses")
export class Addresses {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    line1!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    line2!: string;

    @Column({
        type: "varchar",
        length: 150,
        nullable: true,
    })
    area!: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    city!: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    state!: string;

    @Column({
        type: "varchar",
        length: 100,
        default: "India",
    })
    country!: string;

    @Column({
        type: "varchar",
        length: 10,
    })
    pincode!: string;

    // Latitude Example: 18.5204
    @Column({
        type: "decimal",
        precision: 10,
        scale: 7,
        nullable: true,
    })
    latitude!: number;

    // Longitude Example: 73.8567
    @Column({
        type: "decimal",
        precision: 10,
        scale: 7,
        nullable: true,
    })
    longitude!: number;

    @OneToMany(() => Users, (user) => user.address)
    users!: Users[];

    @OneToMany(() => Salons, (salon) => salon.address)
    salons!: Salons[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}