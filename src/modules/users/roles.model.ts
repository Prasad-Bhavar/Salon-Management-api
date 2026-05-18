import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";

import { Users } from "~/modules/users/users.model";

@Entity("roles")
export class Roles {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 100,
        unique: true,
    })
    name!: string;

    @Column({
        type: "varchar",
        length: 100,
        unique: true,
    })
    slug!: string;

    @Column({
        type: "text",
        nullable: true,
    })
    description!: string;

    @OneToMany(() => Users, (user) => user.role)
    users!: Users[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

}