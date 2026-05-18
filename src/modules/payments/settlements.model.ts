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

import { Salons } from "~/modules/salons/salons.model";
import { Payments } from "~/modules/payments/payments.model";

@Entity("settlements")
export class Settlements {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Salons)
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    total_amount!: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        default: 0,
    })
    commission!: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    net_amount!: number;

    @Column({
        type: "enum",
        enum: ["pending", "processed", "failed"],
        default: "pending",
    })
    status!: string;

    @Column({
        type: "date",
    })
    settlement_date!: string;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    processed_at!: Date;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
    })
    payment_method!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    payout_reference!: string;

    @Column({
        type: "date",
    })
    start_date!: string;

    @Column({
        type: "date",
    })
    end_date!: string;

    @OneToMany(() => Payments, (payment) => payment.settlement)
    payments!: Payments[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

}