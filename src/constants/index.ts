import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "dev";
export const DB_NAME = process.env.DB_NAME || "hoaxify_dev";
export const DB_USER = process.env.DB_USER || "noer";
export const DB_PASSWORD = process.env.DB_PASSWORD || "password";
