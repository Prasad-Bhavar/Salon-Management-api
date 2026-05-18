import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";

import { ServicesMaster } from "~/modules/services/services-master.model";

@Entity("service_categories")
export class ServiceCategories {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 100,
        unique: true,
    })
    name!: string;

    @OneToMany(() => ServicesMaster, (service) => service.category)
    services!: ServicesMaster[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}