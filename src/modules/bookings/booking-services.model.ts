import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { Bookings } from "~/modules/bookings/bookings.model";
import { ServicesMaster } from "~/modules/services/services-master.model";

@Entity("booking_services")
export class BookingServices {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Bookings, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "booking_id" })
    booking!: Bookings;

    @ManyToOne(() => ServicesMaster)
    @JoinColumn({ name: "service_id" })
    service!: ServicesMaster;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    price!: number;

    // In minutes
    @Column({
        type: "int",
    })
    duration!: number;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}