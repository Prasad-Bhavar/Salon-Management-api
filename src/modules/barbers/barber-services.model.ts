import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";

import { Barbers } from "~/modules/barbers/barbers.model";
import { ServicesMaster } from "~/modules/services/services-master.model";

@Entity("barber_services")

@Unique(["barber", "service"])
export class BarberServices {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Barbers, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "barber_id" })
    barber!: Barbers;

    @ManyToOne(() => ServicesMaster, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "service_id" })
    service!: ServicesMaster;

}