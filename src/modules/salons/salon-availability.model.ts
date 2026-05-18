import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { Salons } from "~/modules/salons/salons.model";

@Entity("salon_availability")
export class SalonAvailability {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Salons, (salon) => salon.availability, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @Column({
        type: "varchar",
        length: 20,
    })
    day_of_week!: string;

    @Column({
        type: "time",
        nullable: true,
    })
    start_time!: string;

    @Column({
        type: "time",
        nullable: true,
    })
    end_time!: string;

    @Column({
        type: "boolean",
        default: false,
    })
    is_closed!: boolean;

    @Column({
        type: "int",
        default: 1,
    })
    capacity!: number;

}