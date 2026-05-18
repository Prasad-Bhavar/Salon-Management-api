import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { Salons } from "~/modules/salons/salons.model";

@Entity("salon_bank_details")
export class SalonBankDetails {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Salons, (salon) => salon.bank_details, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @Column({
        type: "varchar",
        length: 255,
    })
    account_holder_name!: string;

    @Column({
        type: "bigint",
    })
    account_number!: string;

    @Column({
        type: "varchar",
        length: 20,
    })
    ifsc_code!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    bank_name!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    upi_id!: string;

    @Column({
        type: "boolean",
        default: true,
    })
    is_active!: boolean;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}