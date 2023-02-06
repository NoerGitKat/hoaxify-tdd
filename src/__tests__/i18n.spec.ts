import { expect } from "@jest/globals";
import db from "../config/db";
import { createUser } from "../helpers";
import translations from "../locales";
import { User } from "../models";
import { EmailService } from "../services";

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

  it("returns email failure message when sending mail fails in NL", async () => {
    const mockSendMail = jest.spyOn(EmailService, "sendAccountActivationMail").mockRejectedValue({
      message: translations.nl.emailFailure,
    });
    const response = await createUser(
      {
        username: "user2",
        email: "user2@mail.com",
        password: "P4ssword",
      },
      { language: "nl" }
    );
    expect(response.body.message).toBe(translations.nl.emailFailure);
    mockSendMail.mockRestore();
  });
});
