import { NextFunction, Request, Response } from "express";

export function validateUser(
  req: Request<{
    username: string | null;
    password: string | null;
    email: string | null;
  }>,
  res: Response,
  next: NextFunction
) {
  const errors = { validationErrors: { username: "", password: "", email: "" } };

  for (const key in req.body) {
    if (!req.body[key]) {
      errors.validationErrors[key as "username" | "password" | "email"] = `No ${key} given.`;
    }
  }

  if (
    errors.validationErrors.username !== "" ||
    errors.validationErrors.password !== "" ||
    errors.validationErrors.email !== ""
  ) {
    return res.status(422).json(errors);
  }

  return next();
}
