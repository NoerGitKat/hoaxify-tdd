import { Request, Response } from "express";
import { User } from "../models";

export async function registerUser(req: Request, res: Response) {
  try {
    const newUser = await User.create(req.body);
    if (newUser) {
      return res.status(200).json({ message: "Registered!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
