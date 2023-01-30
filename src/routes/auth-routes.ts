import { Router } from "express";
import { registerUser } from "../controllers";

const authRouter = Router();

authRouter.route("/register").post(registerUser);

export default authRouter;
