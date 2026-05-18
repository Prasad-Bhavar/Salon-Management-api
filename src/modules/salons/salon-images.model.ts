import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { Salons } from "~/modules/salons/salons.model";

@Entity("salons_images")
export class SalonImages {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Salons, (salon) => salon.images, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @Column({
        type: "varchar",
        length: 500,
    })
    image_url!: string;

    @Column({
        type: "boolean",
        default: false,
    })
    is_primary!: boolean;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}