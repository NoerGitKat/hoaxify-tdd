import { hash } from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models";

export async function registerUser(
  req: Request<{
    username: string | null;
    password: string | null;
    email: string | null;
  }>,
  res: Response
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: { [key: string]: string } = {};
    errors.array().forEach(({ param, msg }) => {
      return (validationErrors[param] = req.t(msg));
    });

    return res.status(422).json({ validationErrors });
  }

  try {
    const hashedPassword = await hash(req.body.password, 10);
    const hashedUser = {
      ...req.body,
      password: hashedPassword,
    };
    const newUser = await User.create(hashedUser);
    if (newUser) {
      return res.status(200).json({ message: req.t("registerSuccess") });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
