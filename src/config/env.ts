import dotenv from "dotenv";

dotenv.config();

const required = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  port: Number(process.env.PORT) || 5000,

  db: {
    host: required(process.env.DB_HOST, "DB_HOST"),
    port: Number(process.env.DB_PORT) || 5432,
    user: required(process.env.DB_USER, "DB_USER"),
    password: required(process.env.DB_PASSWORD, "DB_PASSWORD"),
    name: required(process.env.DB_NAME, "DB_NAME"),
  },
};