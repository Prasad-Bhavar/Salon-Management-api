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

import { Bookings } from "~/modules/bookings/bookings.model";
import { Settlements } from "~/modules/payments/settlements.model";
import { PaymentGatewayLogs } from "~/modules/payments/payment-gateway-logs.model";

@Entity("payments")
export class Payments {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Bookings)
    @JoinColumn({ name: "booking_id" })
    booking!: Bookings;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    amount!: number;

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
        enum: ["pending", "paid", "failed"],
        default: "pending",
    })
    status!: string;

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
    transaction_ref!: string;

    @Column({
        type: "enum",
        enum: ["pending", "paid", "failed"],
        default: "pending",
    })
    transaction_status!: string;

    @ManyToOne(() => Settlements, {
        nullable: true,
    })
    @JoinColumn({ name: "settlement_id" })
    settlement!: Settlements;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    paid_at!: Date;

    @OneToMany(() => PaymentGatewayLogs, (log) => log.payment)
    gateway_logs!: PaymentGatewayLogs[];

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

}