import { Router } from "express";
import { registerUser } from "../controllers";
import { validateUser } from "../middlewares";

const authRouter = Router();

authRouter.route("/register").post(validateUser, registerUser);

export default authRouter;
