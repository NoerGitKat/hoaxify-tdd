import request from "supertest";
import { app } from "../server";
import { TUser } from "../types";

export const createUser = (
  user: TUser = { username: "user1", email: "user1@mail.com", password: "P4ssword" },
  options: { language?: string } = {}
) => {
  const agent = request(app).post("/api/v1/auth/register");
  if (options.language) {
    agent.set("Accept-Language", options.language);
  }
  return agent.send(user);
};
