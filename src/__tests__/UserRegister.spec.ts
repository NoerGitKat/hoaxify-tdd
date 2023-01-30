import request from "supertest";
import { app } from "../server";

describe("Authentication tests", () => {
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
});
