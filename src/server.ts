import express from "express";
import i18next from "i18next";
import I18NexFsBackend, { FsBackendOptions } from "i18next-fs-backend";
import { handle, LanguageDetector } from "i18next-http-middleware";
import { join } from "path";
import db from "./config/db";
import { NODE_ENV, PORT } from "./constants";
import { authRouter } from "./routes";

// Middlewares
i18next
  .use(I18NexFsBackend)
  .use(LanguageDetector)
  .init<FsBackendOptions>({
    fallbackLng: "en",
    lng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: join(__dirname, "./locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      lookupHeader: "accept-language",
    },
  });

export const app = express();

app.use(handle(i18next));
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);

(async function startServer() {
  if (NODE_ENV !== "test") {
    app.listen(PORT, function startServer() {
      console.log(`Server is listening on port: ${PORT}`);
    });

    await db.sync({ force: true });
  }
})();
