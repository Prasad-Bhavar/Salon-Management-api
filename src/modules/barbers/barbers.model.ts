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
import { BarberServices } from "~/modules/barbers/barber-services.model";
import { Bookings } from "~/modules/bookings/bookings.model";
@Entity("barbers")
export class Barbers {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Users)
    @JoinColumn({ name: "user_id" })
    user!: Users;

    @ManyToOne(() => Salons)
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    specialization!: string;

    @Column({
        type: "enum",
        enum: ["active", "inactive", "on_leave"],
        default: "active",
    })
    status!: string;

    @OneToMany(() => BarberServices, (barberService) => barberService.barber)
    barber_services!: BarberServices[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

    @OneToMany(() => Bookings, (booking) => booking.preferred_barber)
    preferred_bookings!: Bookings[];
}