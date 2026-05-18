import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { Payments } from "~/modules/payments/payments.model";

@Entity("payment_gateway_logs")
export class PaymentGatewayLogs {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Payments, (payment) => payment.gateway_logs, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "payment_id" })
    payment!: Payments;

    @Column({
        type: "varchar",
        length: 100,
    })
    gateway_name!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    gateway_payment_id!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    gateway_order_id!: string;

    @Column({
        type: "varchar",
        length: 500,
        nullable: true,
    })
    gateway_signature!: string;

    @Column({
        type: "text",
        nullable: true,
    })
    raw_response!: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
    })
    status!: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}