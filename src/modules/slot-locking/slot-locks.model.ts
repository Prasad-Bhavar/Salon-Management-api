import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { Salons } from "~/modules/salons/salons.model";
import { Users } from "~/modules/users/users.model";

@Entity("slot_locks")
export class SlotLocks {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Salons, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @Column({
        type: "date",
    })
    slot_date!: string;

    @Column({
        type: "time",
    })
    start_time!: string;

    @Column({
        type: "time",
    })
    end_time!: string;

    @ManyToOne(() => Users)
    @JoinColumn({ name: "customer_id" })
    customer!: Users;

    @Column({
        type: "timestamp",
    })
    locked_until!: Date;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}