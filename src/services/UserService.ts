import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import db from "../config/db";
import { isError } from "../helpers";
import { User } from "../models";
import EmailService from "./EmailService";

async function save(user: { username: string; password: string; email: string }) {
  const { username, password, email } = user;
  const hashedPassword = await hash(password, 10);
  const hashedUser = {
    username,
    email,
    password: hashedPassword,
    activationToken: generateToken(16),
  };
  const transaction = await db.transaction();
  const newUser = await User.create(hashedUser, { transaction });
  try {
    await EmailService.sendAccountActivationMail(hashedUser.email, hashedUser.activationToken);
    await transaction.commit();
    return newUser;
  } catch (error) {
    await transaction.rollback();
    if (isError(error)) {
      throw new Error(error.message);
    }
  }
}

async function findByEmail(email: string) {
  return await User.findOne({ where: { email } });
}

function generateToken(length: number) {
  return randomBytes(length).toString("hex");
}

export default { save, findByEmail };
