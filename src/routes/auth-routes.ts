import { Router } from "express";
import { check } from "express-validator";
import { registerUser } from "../controllers";
import { activateAccount } from "../controllers/auth-controllers";
import { isNewEmail } from "../middlewares";

const authRouter = Router();

authRouter.route("/register").post(
  [
    check("username")
      .notEmpty()
      .withMessage("usernameEmpty")
      .bail()
      .isLength({ min: 4, max: 32 })
      .withMessage("usernameLength"),
    check("password")
      .notEmpty()
      .withMessage("passwordEmpty")
      .bail()
      .isLength({ min: 6 })
      .withMessage("passwordLength")
      .bail()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .withMessage("passwordReqs"),
    check("email")
      .notEmpty()
      .withMessage("emailEmpty")
      .bail()
      .isEmail()
      .withMessage("emailInvalid")
      .bail()
      .custom(isNewEmail),
  ],
  registerUser
);

authRouter.route("/token/:token").post(activateAccount);

export default authRouter;
