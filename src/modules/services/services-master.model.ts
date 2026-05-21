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

import { ServiceCategories } from "~/modules/services/service-categories.model";
import { SalonServices } from "~/modules/salon-services/salon-services.model";
import { BarberServices } from "~/modules/barbers/barber-services.model";

@Entity("services_master")
export class ServicesMaster {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    name!: string;

    @ManyToOne(() => ServiceCategories, (category) => category.services)
    @JoinColumn({ name: "category_id" })
    category!: ServiceCategories;

    @Column({
        type: "text",
        nullable: true,
    })
    description!: string;

    @Column({
        type: "varchar",
        length: 500,
        nullable: true,
    })
    image!: string;

    @Column({
        type: "enum",
        enum: ["male", "female", "unisex"],
        default: "unisex",
    })
    gender_type!: string;

    // Duration in minutes
    @Column({
        type: "int",
    })
    default_duration!: number;

    @Column({
        type: "boolean",
        default: true,
    })
    is_active!: boolean;

    @OneToMany(() => SalonServices, (salonService) => salonService.service)
    salon_services!: SalonServices[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

    @OneToMany(() => BarberServices, (barberService) => barberService.service)
    barber_services!: BarberServices[];


}