import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { Bookings } from "~/modules/bookings/bookings.model";
import { Salons } from "~/modules/salons/salons.model";

@Entity("booking_slots")
export class BookingSlots {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Bookings, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "booking_id" })
    booking!: Bookings;

    @ManyToOne(() => Salons)
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

}