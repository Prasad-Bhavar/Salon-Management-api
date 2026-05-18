import { AppDataSource } from "~/config/database";

import { Roles } from "~/modules/users/roles.model";

export const seedRoles = async () => {
    try {
        const roleRepository = AppDataSource.getRepository(Roles);

        const roles = [
            {
                name: "admin",
                slug: "admin",
                description: "System administrator",
            },

            {
                name: "owner",
                slug: "owner",
                description: "Salon owner",
            },

            {
                name: "customer",
                slug: "customer",
                description: "Customer user",
            },
        ];

        for (const roleData of roles) {
            const existingRole = await roleRepository.findOne({
                where: {
                    slug: roleData.slug,
                },
            });

            if (!existingRole) {
                const role = roleRepository.create(roleData);

                await roleRepository.save(role);

                console.log(`✅ Role created: ${role.name}`);
            } else {
                console.log(`⚠️ Role already exists: ${roleData.name}`);
            }
        }

        console.log("🎉 Roles seeding completed.");
    } catch (error) {
        console.error("❌ Roles seeding failed:", error);
    }
};