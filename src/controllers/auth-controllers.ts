import { hash } from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models";

export async function registerUser(req: Request, res: Response) {
  try {
    const hashedPassword = await hash(req.body.password, 10);
    const user = {
      ...req.body,
      password: hashedPassword,
    };
    const newUser = await User.create(user);
    if (newUser) {
      return res.status(200).json({ message: "Registered!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
