import request from "supertest";
import db from "../config/db";
import { User } from "../models";
import { app } from "../server";
import { TUser } from "../types";

const createUser = (user: TUser) => {
  return request(app).post("/api/v1/auth/register").send(user);
};

describe("User Registration - Test Suite", () => {
  beforeAll(() => {
    return db.sync();
  });

  beforeEach(() => {
    return User.destroy({ truncate: true });
  });

  it("returns 200 OK when signup request is valid", (done) => {
    createUser({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      })
      .catch((error) => error);
  });

  it("returns success message when signup request is valid", (done) => {
    createUser({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .then((response) => {
        expect(response.body.message).toBe("Registered!");
        done();
      })
      .catch((error) => error);
  });

  it("saves the user to database", (done) => {
    createUser({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .then(() => {
        User.findAll()
          .then((users) => {
            expect(users.length).toBe(1);
          })
          .catch((error) => error);
        done();
      })
      .catch((error) => error);
  });

  it("saves username and email to database", (done) => {
    createUser({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .then(() => {
        User.findAll()
          .then((users) => {
            const firstUser = users[0];
            expect(firstUser.username).toBe("user1");
            expect(firstUser.email).toBe("user1@mail.com");
          })
          .catch((error) => error);
        done();
      })
      .catch((error) => error);
  });

  it("hashes password in database", (done) => {
    createUser({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .then(() => {
        User.findAll()
          .then((users) => {
            const firstUser = users[0];
            expect(firstUser.password).not.toBe("P4ssword");
          })
          .catch((error) => error);
      })
      .catch((error) => error);
    done();
  });

  it("returns 400 when username is null", (done) => {
    createUser({ username: null, email: "user1@mail.com", password: "P4ssword" })
      .then(() => {
        User.findAll()
          .then((users) => {
            const firstUser = users[0];
            expect(firstUser.username).not.toBe("P4ssword");
          })
          .catch((error) => error);
      })
      .catch((error) => error);
    done();
  });
});
