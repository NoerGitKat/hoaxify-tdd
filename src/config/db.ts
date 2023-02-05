import { Sequelize } from "sequelize-typescript";
import { DB_NAME, DB_PASSWORD, DB_USER, NODE_ENV } from "../constants";
import { User } from "../models";

const db = new Sequelize({
  database: DB_NAME,
  dialect: "sqlite",
  username: DB_USER,
  password: DB_PASSWORD,
  storage: NODE_ENV === "test" ? ":memory:" : "./src/db/db.sqlite",
  models: [User],
  logging: false,
});

export default db;
