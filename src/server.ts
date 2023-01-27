import express from "express";
import { PORT } from "./constants";

const app = express();

app.listen(PORT, function startServer() {
  console.log(`Server is listening on port: ${PORT}`);
});
