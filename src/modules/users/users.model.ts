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

import { Roles } from "~/modules/users/roles.model";
import { Addresses } from "~/modules/addresses/addresses.model";
import { Salons } from "~/modules/salons/salons.model";
import { Barbers } from "~/modules/barbers/barbers.model";
import { Bookings } from "~/modules/bookings/bookings.model";
import { SlotLocks } from "~/modules/slot-locking/slot-locks.model";
import { Notifications } from "~/modules/notifications/notifications.model";
import { Reviews } from "~/modules/reviews/reviews.model";

@Entity("users")
export class Users {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    name!: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
    })
    email!: string;

    @Column({
        type: "varchar",
        select: false, // hides password in normal queries
    })
    password!: string;

    @ManyToOne(() => Roles)
    @JoinColumn({ name: "role_id" })
    role!: Roles;

    @OneToMany(() => Salons, (salon) => salon.owner)
    salons!: Salons[];

    @Column({
        type: "enum",
        enum: ["active", "inactive"],
        default: "active",
    })
    status!: string;

    @Column({
        type: "varchar",
        length: 20,
    })
    contact1!: string;

    @Column({
        type: "varchar",
        length: 20,
        nullable: true,
    })
    contact2!: string;

    @ManyToOne(() => Addresses, { nullable: true })
    @JoinColumn({ name: "address_id" })
    address!: Addresses;

    @Column({
        type: "enum",
        enum: ["male", "female", "other"],
    })
    gender!: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

    @OneToMany(() => Barbers, (barber) => barber.user)
    barber_profiles!: Barbers[];

    @OneToMany(() => Bookings, (booking) => booking.customer)
    bookings!: Bookings[];

    @OneToMany(() => SlotLocks, (slotLock) => slotLock.customer)
    slot_locks!: SlotLocks[];

    @OneToMany(() => Notifications, (notification) => notification.user)
    notifications!: Notifications[];

    @OneToMany(() => Reviews, (review) => review.customer)
    reviews!: Reviews[];
}