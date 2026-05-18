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

import { Users } from "~/modules/users/users.model";
import { Salons } from "~/modules/salons/salons.model";
import { ReviewImages } from "~/modules/reviews/review-images.model";

@Entity("reviews")
export class Reviews {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Users, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "customer_id" })
    customer!: Users;

    @ManyToOne(() => Salons, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "salon_id" })
    salon!: Salons;

    @Column({
        type: "int",
    })
    rating!: number;

    @Column({
        type: "text",
        nullable: true,
    })
    comment!: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updated_at!: Date;

    @OneToMany(() => ReviewImages, (image) => image.review)
    images!: ReviewImages[];

}