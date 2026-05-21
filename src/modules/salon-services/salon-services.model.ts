import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

import { Salons } from "~/modules/salons/salons.model";
import { ServicesMaster } from "~/modules/services/services-master.model";

@Entity("salon_services")
export class SalonServices {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Salons, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @ManyToOne(() => ServicesMaster, (service) => service.salon_services, { onDelete: "CASCADE" })
    @JoinColumn({ name: "service_id" }) // ✅ THIS WAS MISSING — add this
    service!: ServicesMaster;

    // Price in smallest currency unit or normal rupees
    @Column({
        type: "int",
    })
    price!: number;

    // Duration in minutes
    @Column({
        type: "int",
    })
    duration!: number;

    @Column({
        type: "boolean",
        default: true,
    })
    status!: boolean;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

    @Column({
        type: "text",
        nullable: true,
    })
    description!: string;

}