import { expect } from "@jest/globals";
import { SMTPServer } from "smtp-server";
import db from "../config/db";
import { activateToken, createUser } from "../helpers";
import translations from "../locales";
import { User } from "../models";
import { THTTPError } from "../types";

let lastMail = "";
let smtpServer: SMTPServer;
let simulateSmtpFailure = false;

beforeAll(async () => {
  smtpServer = new SMTPServer({
    authOptional: true,
    onData: (stream, _session, callback) => {
      let mailBody = "";
      stream.on("data", (data) => {
        mailBody += data.toString();
      });
      stream.on("end", () => {
        if (simulateSmtpFailure) {
          const error = new Error("Invalid mailbox") as THTTPError;
          error.responseCode = 553;
          return callback(error);
        }
        lastMail = mailBody;
        callback();
      });
    },
  });

  smtpServer.listen(8587, "localhost");

  await db.sync();
});

beforeEach(() => {
  simulateSmtpFailure = false;
  return User.destroy({ truncate: true });
});

afterAll(() => {
  smtpServer.close();
});

describe("User Registration - Test Suite", () => {
  it("returns 200 OK when signup request is valid", async () => {
    const response = await createUser({
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
    });

    expect(response.status).toBe(200);
  });

  it("returns success message when signup request is valid", async () => {
    const response = await createUser({
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
    });

    return expect(response.body.message).toBe(translations.en.registerSuccess);
  });

  it("saves the user to database", async () => {
    await createUser({
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
    });
    const users = await User.findAll();

    return expect(users.length).toBe(1);
  });

  it("saves username and email to database", async () => {
    await createUser({
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
    });
    const users = await User.findAll();

    const firstUser = users[0];
    expect(firstUser.username).toBe("user1");
    expect(firstUser.email).toBe("user1@mail.com");
  });

  it("hashes password in database", async () => {
    await createUser({
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
    });
    const users = await User.findAll();

    const firstUser = users[0];
    return expect(firstUser.password).not.toBe("P4ssword");
  });

  it("returns 422 when username is null", async () => {
    const response = await createUser({
      username: null,
      email: "user1@mail.com",
      password: "P4ssword",
    });
    return expect(response.status).toBe(422);
  });

  it.each([
    ["username", translations.en.usernameEmpty],
    ["email", translations.en.emailEmpty],
  ])("When %s is null respond with: %s", async (field, expectedMessage) => {
    const response = await createUser({
      username: null,
      email: null,
      password: "P4ssword",
    });

    return expect(response.body.validationErrors[field]).toBe(expectedMessage);
  });

  it("must return a validation error if username is shorter than 4 characters or higher than 32", async () => {
    const response = await createUser({
      username: "usr",
      email: "user1@mail.com",
      password: "P4ssword",
    });
    return expect(response.body.validationErrors.username).toBe(translations.en.usernameLength);
  });

  it("must return a validation error if email is not valid", async () => {
    const response = await createUser({
      username: "usr",
      email: "user1@mai",
      password: "P4ssword",
    });
    return expect(response.body.validationErrors.email).toBe(translations.en.emailInvalid);
  });

  it("must return a validation error if password is not at least 6 characters", async () => {
    const response = await createUser({
      username: "usr",
      email: "user1@mai",
      password: "poop",
    });
    return expect(response.body.validationErrors.password).toBe(translations.en.passwordLength);
  });

  it("must return a validation error if password doesn't satisfy requirements", async () => {
    const response = await createUser({
      username: "usr",
      email: "user1@mai",
      password: "alllowercaseyo",
    });
    return expect(response.body.validationErrors.password).toBe(translations.en.passwordReqs);
  });

  it("returns 'Email in use' when the email already exists", async () => {
    await User.create({
      username: "user1ishere",
      email: "thisistest@mail.com",
      password: "alllowercaseyo",
    });
    const response = await createUser({
      username: "user2",
      email: "thisistest@mail.com",
      password: "yesyesYes2",
    });

    return expect(response.body.validationErrors.email).toBe(translations.en.emailInUse);
  });

  it("returns all errors is username is null and email in use", async () => {
    await User.create({
      username: "user1ishere",
      email: "thisistest@mail.com",
      password: "alllowercaseyo",
    });
    const response = await createUser({
      username: null,
      email: "thisistest@mail.com",
      password: "P4ssword",
    });

    return expect(Object.keys(response.body.validationErrors)).toEqual(["username", "email"]);
  });

  it("creates user in inactive mode", async () => {
    await createUser();
    const users = await User.findAll();
    const firstUser = users[0];

    expect(firstUser.inactive).toBe(true);
  });

  it("creates user in inactive mode also when inactive is false", async () => {
    const newUser = {
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
      inactive: false,
    };
    await createUser(newUser);
    const users = await User.findAll();
    const firstUser = users[0];

    expect(firstUser.inactive).toBe(true);
  });

  it("creates activation token for user after register", async () => {
    await createUser();
    const users = await User.findAll();
    const firstUser = users[0];

    expect(firstUser.activationToken).toBeTruthy();
  });

  it("sends an account activation mail with activation token", async () => {
    await createUser();

    const users = await User.findAll();
    const firstUser = users[0];

    expect(lastMail).toContain("user1@mail.com");
    expect(lastMail).toContain(firstUser.activationToken);
  });

  it("returns 502 status code when sending email fails", async () => {
    simulateSmtpFailure = true;
    const response = await createUser();
    expect(response.status).toBe(502);
  });

  it("returns email failure message when sending mail fails", async () => {
    simulateSmtpFailure = true;
    const response = await createUser();
    expect(response.body.message).toBe(translations.en.emailFailure);
  });

  it("does not save user to database if activation email fails", async () => {
    simulateSmtpFailure = true;
    const newUser = { username: "user1", email: "user1@mail.com", password: "P4ssword" };
    await createUser(newUser);
    const user = await User.findOne({ where: { email: newUser.email } });
    expect(user).toBeNull();
  });
});

describe("I18n", () => {
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
    simulateSmtpFailure = true;
    const response = await createUser(
      {
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      },
      { language: "nl" }
    );
    expect(response.body.message).toBe(translations.nl.emailFailure);
  });
});

describe("account activation", () => {
  it("activates the new account when correct token is sent", async () => {
    await createUser();
    const users = await User.findAll();
    const token = users[0].activationToken;
    if (token) await activateToken(token);
    const currentUser = await User.findOne({ where: { activationToken: token } });
    if (currentUser) {
      expect(currentUser.inactive).toBe(false);
    }
  });
  it("remove token from user after success account activation", async () => {
    await createUser();
    const users = await User.findAll();
    const token = users[0].activationToken;
    if (token) await activateToken(token);
    const currentUser = await User.findOne({ where: { activationToken: token } });
    if (currentUser) {
      expect(currentUser.activationToken).toBeFalsy();
    }
  });
  it("does not activate account when token is invalid", async () => {
    await createUser();
    const invalidToken = "123asda";
    await activateToken(invalidToken);
    const users = await User.findAll();
    expect(users[0].inactive).toBe(true);
  });
  it("throws an error when token is invalid", async () => {
    await createUser();
    const invalidToken = "123asda";
    const response = await activateToken(invalidToken);

    expect(response.body.message).toBe(translations.en.invalidToken);
  });
});
