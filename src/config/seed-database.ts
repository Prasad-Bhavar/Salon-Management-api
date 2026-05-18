import "reflect-metadata";
import { env } from "./env";
import { DataSource } from "typeorm";

export const SeedDataSource = new DataSource({
  type: "postgres",

  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,

  synchronize: false,
  logging: true,

  entities: ["src/modules/**/*.ts"],
});