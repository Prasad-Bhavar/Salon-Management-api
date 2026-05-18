import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("settings")
export class Settings {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 150,
        unique: true,
    })
    key!: string;

    @Column({
        type: "text",
    })
    value!: string;

    @Column({
        type: "varchar",
        length: 500,
        nullable: true,
    })
    description!: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

}