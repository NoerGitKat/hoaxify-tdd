import request from "supertest";
import db from "../config/db";
import { User } from "../models";
import { app } from "../server";
import { TUser } from "../types";

const createUser = (
  user: TUser = { username: "user1", email: "user1@mail.com", password: "P4ssword" }
) => {
  return request(app).post("/api/v1/auth/register").send(user);
};

describe("User Registration - Test Suite", () => {
  beforeAll(() => {
    return db.sync();
  });

  beforeEach(() => {
    return User.destroy({ truncate: true });
  });

  it("returns 200 OK when signup request is valid", async () => {
    const response = await createUser({
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
    });

    expect(response.status).toBe(200);
  });

  // it("returns success message when signup request is valid", async () => {
  //   const response = await createUser({
  //     username: "user1",
  //     email: "user1@mail.com",
  //     password: "P4ssword",
  //   });

  //   return expect(response.body.message).toBe("Registered!");
  // });

  // it("saves the user to database", async () => {
  //   await createUser({
  //     username: "user1",
  //     email: "user1@mail.com",
  //     password: "P4ssword",
  //   });
  //   const users = await User.findAll();

  //   return expect(users.length).toBe(1);
  // });

  // it("saves username and email to database", async () => {
  //   await createUser({
  //     username: "user1",
  //     email: "user1@mail.com",
  //     password: "P4ssword",
  //   });
  //   const users = await User.findAll();

  //   const firstUser = users[0];
  //   expect(firstUser.username).toBe("user1");
  //   expect(firstUser.email).toBe("user1@mail.com");
  // });

  // it("hashes password in database", async () => {
  //   await createUser({
  //     username: "user1",
  //     email: "user1@mail.com",
  //     password: "P4ssword",
  //   });
  //   const users = await User.findAll();

  //   const firstUser = users[0];
  //   return expect(firstUser.password).not.toBe("P4ssword");
  // });

  // it("returns 422 when username is null", async () => {
  //   const response = await createUser({
  //     username: null,
  //     email: "user1@mail.com",
  //     password: "P4ssword",
  //   });
  //   return expect(response.status).toBe(422);
  // });

  it.each([
    ["username", "No username given."],
    ["email", "No email given."],
  ])("when %s is null %s cannot be null", async (field, expectedMessage) => {
    const response = await createUser({
      username: null,
      email: null,
      password: "P4ssword",
    });
    return expect(response.body.validationErrors[field]).toBe(expectedMessage);
  });

  //   (
  //   "returns validation errors for username in response body when error occurs",
  //   async () => {
  //     const response = await createUser({
  //       username: null,
  //       email: "user1@mail.com",
  //       password: "P4ssword",
  //     });
  //     return expect(response.body.validationErrors.username).toBe("No username given.");
  //   }
  // );
});
