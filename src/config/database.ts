import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",

  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,

  synchronize: false,
  logging: false,

  entities: ["src/modules/**/*.ts"],
  migrations: ["src/db/migrations/*.ts"],
});