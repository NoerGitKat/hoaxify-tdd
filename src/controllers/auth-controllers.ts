import { hash } from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models";

export async function registerUser(req: Request, res: Response) {
  if (!req.body.username) {
    return res.status(422).json({ message: "No username given." });
  }
  try {
    const hashedPassword = await hash(req.body.password, 10);
    const hashedUser = {
      ...req.body,
      password: hashedPassword,
    };
    const newUser = await User.create(hashedUser);
    if (newUser) {
      return res.status(200).json({ message: "Registered!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
