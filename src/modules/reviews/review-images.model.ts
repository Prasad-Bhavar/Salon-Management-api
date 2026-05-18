import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";

import { Reviews } from "~/modules/reviews/reviews.model";

@Entity("review_images")
export class ReviewImages {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Reviews, (review) => review.images, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "review_id" })
    review!: Reviews;

    @Column({
        type: "varchar",
        length: 500,
    })
    image_url!: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;

}