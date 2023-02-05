import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { EmailService, UserService } from "../services";
import { TUser } from "../types";

export async function registerUser(req: Request<TUser>, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: { [key: string]: string } = {};
    errors.array().forEach(({ param, msg }) => {
      return (validationErrors[param] = req.t(msg));
    });

    return res.status(422).json({ validationErrors });
  }

  try {
    const newUser = await UserService.save(req.body);
    if (newUser) {
      await EmailService.sendAccountActivitationMail(newUser.email, newUser.activationToken);
      return res.status(200).json({ message: req.t("registerSuccess") });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
