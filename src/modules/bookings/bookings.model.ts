import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";

import { Users } from "~/modules/users/users.model";
import { Salons } from "~/modules/salons/salons.model";
import { Barbers } from "~/modules/barbers/barbers.model";
import { BookingServices } from "~/modules/bookings/booking-services.model";
import { BookingSlots } from "~/modules/bookings/booking-slots.model";
import { Payments } from "~/modules/payments/payments.model";

@Entity("bookings")
export class Bookings {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Users)
    @JoinColumn({ name: "customer_id" })
    customer!: Users;

    @ManyToOne(() => Salons)
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @ManyToOne(() => Barbers, {
        nullable: true,
    })
    @JoinColumn({ name: "preferred_barber_id" })
    preferred_barber!: Barbers;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    total_price!: number;

    // In minutes
    @Column({
        type: "int",
    })
    total_duration!: number;

    @Column({
        type: "enum",
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
    })
    status!: string;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    cancelled_at!: Date;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    completed_at!: Date;

    @OneToMany(() => BookingServices, (service) => service.booking)
    booking_services!: BookingServices[];

    @OneToMany(() => BookingSlots, (slot) => slot.booking)
    booking_slots!: BookingSlots[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

    @OneToMany(() => Payments, (payment) => payment.booking)
    payments!: Payments[];

}