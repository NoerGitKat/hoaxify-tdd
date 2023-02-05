import { expect } from "@jest/globals";
import db from "../config/db";
import { createUser } from "../helpers";
import translations from "../locales";
import { User } from "../models";

describe("I18n", () => {
  beforeAll(() => {
    return db.sync();
  });

  beforeEach(() => {
    return User.destroy({ truncate: true });
  });

  it("returns success message when signup request is valid in NL", async () => {
    const response = await createUser(
      {
        username: "user2",
        email: "user1@mail.com",
        password: "P4ssword",
      },
      { language: "nl" }
    );

    return expect(response.body.message).toBe(translations.nl.registerSuccess);
  });
});
