const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const jwt = require("jsonwebtoken");

// the successful situation is set up globally.
// Tests that seek to test edge cases modify the variables before running.
let mockPayload = {
  sub: "1234567890",
  role: "ADMIN",
};

let AUDIENCE = "CIRCLE_AUTH";
let ISSUER = "CIRCLE_AUTH";
let secret = process.env.SECRET_KEY;
let expiresIn = process.env.TOKEN_EXPIRES_IN;

describe("Auth middleware", () => {
  test("returns null user and null token ", async () => {
    const { authMiddleware } = require("./auth");
    const req = {
      headers: {},
    };
    const result = await authMiddleware({ req });

    expect(result).toEqual({
      user: null,
      role: "LOGIN",
    });
  });
});

describe("Auth Utility Tests", () => {
  const { signToken, verifyToken } = require("./tokenHandler");
  describe("signToken", () => {
    describe("successful token generation", () => {
      test("signs a token producing a string", () => {
        const token = signToken(mockPayload, expiresIn, AUDIENCE, ISSUER);
        expect(typeof token).toBe("string");
      });

      test("signs a token with the expected object payload", async () => {
        const token = signToken(mockPayload, expiresIn);
        const decoded = await jwt.verify(token, secret, {
          issuer: ISSUER,
          audience: AUDIENCE,
        });

        expect(decoded).toMatchObject(mockPayload);
      });
    });
    describe("error cases", () => {
      test("throws an error if expiresIn is null", () => {
        const invalidExpiresIn = null;
        expect(() => signToken(mockPayload, invalidExpiresIn)).toThrow();
      });
      test("throws an error if no sub in payload", () => {
        const { sub, ...noSubPayload } = mockPayload;
        expect(() => signToken(noSubPayload, expiresIn)).toThrow();
      });
      test("throws an error if no role in payload", () => {
        const { role, ...noRolePayload } = mockPayload;
        expect(() => signToken(noRolePayload, expiresIn)).toThrow();
      });
    });
  });
  describe("checkPassword", () => {
    const { hashPassword, checkPassword } = require("./auth");
    const correctPassword = "jimminyCr23#";
    const incorrectPassword = "HaminyHam#23";
    const emptyPassword = "";
    describe("success casees", () => {
      test("returns true if a password is compared to its corresponding hash", async () => {
        const hash = await hashPassword(correctPassword);
        const checkedPassword = await checkPassword(correctPassword, hash);
        expect(() => checkedPassword.toBe(true));
      });
    });
    describe("failure cases", () => {
      test("throws an error for null hash", async () => {
        expect(() => hashPassword(correctPassword, null).toThrow());
      });
      test("throws an error for null password", async () => {
        const hash = await hashPassword(correctPassword);
        expect(() => hashPassword(null, hash).toThrow());
      });

      test("throws an error if incorrect password is used", async () => {
        const hash = await hashPassword(correctPassword);
        expect(() => checkPassword(incorrectPassword, hash).toThrow());
      });
      test("throws an error if empty password is used", async () => {
        const hash = await hashPassword(correctPassword);
        expect(() => checkPassword(emptyPassword, hash).toThrow());
      });
    });
  });
  describe("hashPassword", () => {
    const { hashPassword, checkPassword } = require("./auth");
    const validPassword = "jimminyCr23#";

    describe("success casees", () => {
      test("retruns a hashed password from a valid password input", async () => {
        const hash = await hashPassword(validPassword);

        const checkedPassword = await checkPassword(validPassword, hash);
        expect(() => checkedPassword.toBe(true));
      });
    });
    describe("failure cases", () => {
      test("throws an error for too short pasword ", async () => {
        const tooShortPassword = "he#2o";
        expect(() => hashPassword(invalidPassword).toThrow());
      });
      test("throws an error for no numbers ", async () => {
        const noNumbersPassword = "he#dsfsssfo";
        expect(() => hashPassword(noNumbersPassword).toThrow());
      });
      test("throws an error for too short pasword ", async () => {
        const noCharactersPassword = "he42sdfsdffo";
        expect(() => hashPassword(noCharactersPassword).toThrow());
      });
    });
  });
  describe("generateAuthCode", () => {
    test("generates a 4 digit code of letters and numbers", async () => {
      const { generateAuthCode } = require("./auth");
      const authCode = generateAuthCode();
      expect(() => authCode.toMatch(/^\d(?:[A-Za-z0-9]{3})$/));
    });
  });
});
