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

export const activateToken = async (token: string) => {
  const response = await request(app).post(`/api/v1/auth/token/${token}`).send();
  return response;
};

export function isError(error: unknown): error is Error {
  if (error && typeof error === "object" && "message" in error) {
    return true;
  }
  return false;
}
