import express from "express";
import db from "./config/db";
import { NODE_ENV, PORT } from "./constants";
import { authRouter } from "./routes";

export const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);

(async function startServer() {
  if (NODE_ENV !== "test") {
    app.listen(PORT, function startServer() {
      console.log(`Server is listening on port: ${PORT}`);
    });

    await db.sync();
  }
})();
