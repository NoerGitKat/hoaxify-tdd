import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import { User } from "../models";
import { TUser } from "../types";

async function save(user: TUser) {
  const { username, password, email } = user;
  const hashedPassword = await hash(password, 10);
  const hashedUser = {
    username,
    email,
    password: hashedPassword,
    activationToken: generateToken(16),
  };
  const newUser = await User.create(hashedUser);
  return newUser;
}

async function findByEmail(email: string) {
  return await User.findOne({ where: { email } });
}

function generateToken(length: number) {
  return randomBytes(length).toString("hex");
}

export default { save, findByEmail };
