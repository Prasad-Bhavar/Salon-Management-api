import bcrypt from "bcrypt";

import { AppDataSource } from "~/config/database";

import { Users } from "~/modules/users/users.model";
import { Roles } from "~/modules/users/roles.model";

export const seedUsers = async () => {
    try {
        const userRepository = AppDataSource.getRepository(Users);

        const roleRepository = AppDataSource.getRepository(Roles);

        // =========================================
        // FETCH ROLES
        // =========================================

        const adminRole = await roleRepository.findOne({
            where: { name: "admin" },
        });

        const ownerRole = await roleRepository.findOne({
            where: { name: "owner" },
        });

        const customerRole = await roleRepository.findOne({
            where: { name: "customer" },
        });

        if (!adminRole || !ownerRole || !customerRole) {
            throw new Error("Roles not found");
        }

        // =========================================
        // HASH PASSWORD
        // =========================================

        const hashedPassword = await bcrypt.hash("Test@123", 10);

        // =========================================
        // USERS
        // =========================================

        const users = [
            // ADMIN
            {
                name: "System Admin",
                email: "admin@salon.com",
                password: hashedPassword,
                role: adminRole,
                status: "active",
                contact1: "9999999991",
                gender: "male",
            },

            // OWNERS
            {
                name: "Rahul Sharma",
                email: "owner@salon.com",
                password: hashedPassword,
                role: ownerRole,
                status: "active",
                contact1: "9999999992",
                gender: "male",
            },

            {
                name: "Priya Beauty Studio",
                email: "priya@salon.com",
                password: hashedPassword,
                role: ownerRole,
                status: "active",
                contact1: "9999999993",
                gender: "female",
            },

            // CUSTOMERS
            {
                name: "Arjun Mehta",
                email: "arjun@gmail.com",
                password: hashedPassword,
                role: customerRole,
                status: "active",
                contact1: "9999999994",
                gender: "male",
            },

            {
                name: "Sneha Kapoor",
                email: "sneha@gmail.com",
                password: hashedPassword,
                role: customerRole,
                status: "active",
                contact1: "9999999995",
                gender: "female",
            },

            {
                name: "Vikram Joshi",
                email: "vikram@gmail.com",
                password: hashedPassword,
                role: customerRole,
                status: "active",
                contact1: "9999999996",
                gender: "male",
            },
        ];

        // =========================================
        // INSERT USERS
        // =========================================

        for (const userData of users) {
            const existingUser = await userRepository.findOne({
                where: {
                    email: userData.email,
                },
            });

            if (!existingUser) {
                const user = userRepository.create(userData);

                await userRepository.save(user);

                console.log(`✅ User created: ${user.email}`);
            } else {
                console.log(`⚠️ User already exists: ${userData.email}`);
            }
        }

        console.log("🎉 Users seeding completed.");
    } catch (error) {
        console.error("❌ User seeding failed:", error);
    }
};