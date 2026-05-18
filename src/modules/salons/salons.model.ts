import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToMany,
} from "typeorm";

import { Users } from "~/modules/users/users.model";
import { Addresses } from "~/modules/addresses/addresses.model";
import { SalonImages } from "~/modules/salons/salon-images.model";
import { SalonBankDetails } from "~/modules/salons/salon-bank-details.model";
import { SalonAvailability } from "~/modules/salons/salon-availability.model";
import { Barbers } from "~/modules/barbers/barbers.model";
import { Bookings } from "~/modules/bookings/bookings.model";
import { BookingSlots } from "~/modules/bookings/booking-slots.model";
import { BlockedSlots } from "~/modules/bookings/blocked-slots.model";
import { SlotLocks } from "~/modules/bookings/slot-locks.model";
import { Settlements } from "~/modules/payments/settlements.model";
import { Reviews } from "~/modules/reviews/reviews.model";

@Entity("salons")
export class Salons {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Users)
    @JoinColumn({ name: "owner_id" })
    owner!: Users;

    @Column({
        type: "varchar",
        length: 255,
    })
    name!: string;

    @Column({
        type: "enum",
        enum: ["male", "female", "unisex"],
    })
    salon_type!: string;

    @ManyToOne(() => Addresses)
    @JoinColumn({ name: "address_id" })
    address!: Addresses;

    @Column({
        type: "enum",
        enum: ["active", "inactive", "pending", "blocked"],
        default: "pending",
    })
    status!: string;

    @OneToMany(() => SalonImages, (image) => image.salon)
    images!: SalonImages[];

    @OneToMany(() => SalonBankDetails, (bank) => bank.salon)
    bank_details!: SalonBankDetails[];

    @OneToMany(() => SalonAvailability, (availability) => availability.salon)
    availability!: SalonAvailability[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @OneToMany(() => Barbers, (barber) => barber.salon)
    barbers!: Barbers[];

    @OneToMany(() => Bookings, (booking) => booking.salon)
    bookings!: Bookings[];

    @OneToMany(() => BookingSlots, (slot) => slot.salon)
    booking_slots!: BookingSlots[];

    @OneToMany(() => BlockedSlots, (slot) => slot.salon)
    blocked_slots!: BlockedSlots[];

    @OneToMany(() => SlotLocks, (slotLock) => slotLock.salon)
    slot_locks!: SlotLocks[];

    @OneToMany(() => Settlements, (settlement) => settlement.salon)
    settlements!: Settlements[];

    @OneToMany(() => Reviews, (review) => review.salon)
    reviews!: Reviews[];

    @Column({ type: "varchar", length: 255, nullable: true })
    email!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    contact_number!: string;
}