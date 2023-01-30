import request from "supertest";
import db from "../config/db";
import { User } from "../models";
import { app } from "../server";

describe("User Registration - Test Suite", () => {
  beforeAll(() => {
    return db.sync();
  });

  beforeEach(() => {
    return User.destroy({ truncate: true });
  });

  it("returns 200 OK when signup request is valid", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .send({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });

  it("returns success message when signup request is valid", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .send({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Registered!");
        done();
      });
  });

  // it("saves the user to database", (done) => {
  //   request(app)
  //     .post("/api/v1/auth/register")
  //     .send({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
  //     .expect(200)
  //     .then(() => {
  //       User.findAll().then((users) => {
  //         expect(users.length).toBe(1);
  //       });
  //       done();
  //     });
  // });

  it("saves username and email to database", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .send({ username: "user1", email: "user1@mail.com", password: "P4ssword" })
      .expect(200)
      .then(() => {
        User.findAll().then((users) => {
          const firstUser = users[0];
          expect(firstUser.username).toBe("user1");
          expect(firstUser.email).toBe("user1@mail.com");
        });
        done();
      });
  });
});
