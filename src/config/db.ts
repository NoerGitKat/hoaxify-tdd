import { Sequelize } from "sequelize-typescript";
import { DB_NAME, DB_PASSWORD, DB_USER } from "../constants";
import { User } from "../models";

const db = new Sequelize({
  database: DB_NAME,
  dialect: "sqlite",
  username: DB_USER,
  password: DB_PASSWORD,
  storage: "./src/database/db.sqlite",
  models: [User],
});

export default db;
