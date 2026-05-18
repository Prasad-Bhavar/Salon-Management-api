import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { Salons } from "~/modules/salons/salons.model";

@Entity("blocked_slots")
export class BlockedSlots {

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
    date!: string;

    @Column({
        type: "time",
    })
    start_time!: string;

    @Column({
        type: "time",
    })
    end_time!: string;

}