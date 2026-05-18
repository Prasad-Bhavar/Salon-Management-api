import "reflect-metadata";

import { AppDataSource } from "~/config/database";

import { seedRoles } from "./role.seeder";
import { seedUsers } from "./user.seeder";

const runSeeders = async () => {
    try {
        // =========================================
        // DB CONNECT
        // =========================================

        await AppDataSource.initialize();

        console.log("✅ Database connected");

        // =========================================
        // RUN SEEDERS
        // =========================================

        await seedRoles();

        await seedUsers();

        console.log("🎉 All seeders completed successfully");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeder failed:", error);

        process.exit(1);
    }
};

runSeeders();