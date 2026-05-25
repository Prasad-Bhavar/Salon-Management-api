import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
} from "typeorm";

import {
    Users,
} from "~/modules/users/users.model";

import {
    Salons,
} from "~/modules/salons/salons.model";

@Entity("favorite_salons")

@Unique([
    "customer",
    "salon",
])

export class FavoriteSalons {

    @PrimaryGeneratedColumn()
    id!: number;

    //
    // CUSTOMER
    //

    @ManyToOne(() => Users, {
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "customer_id",
    })
    customer!: Users;

    //
    // SALON
    //

    @ManyToOne(() => Salons, {
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "salon_id",
    })
    salon!: Salons;

    //
    // CREATED AT
    //

    @CreateDateColumn({
        type: "timestamp",
    })
    created_at!: Date;
}