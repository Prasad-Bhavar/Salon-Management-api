import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

import { Users } from "~/modules/users/users.model";

@Entity("notifications")
export class Notifications {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Users, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user!: Users;

    @Column({
        type: "enum",
        enum: ["booking", "payment", "reminder"],
    })
    type!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    title!: string;

    @Column({
        type: "text",
        nullable: true,
    })
    message!: string;

    // Generic polymorphic reference id
    @Column({
        type: "int",
        nullable: true,
    })
    reference_id!: number;

    // Example:
    // booking | payment | settlement
    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
    })
    reference_type!: string;

    @Column({
        type: "boolean",
        default: false,
    })
    is_read!: boolean;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

}