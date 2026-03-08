require("dotenv").config();
const { signToken, verifyToken } = require("./tokenHandler");
const jwt = require("jsonwebtoken");

// the successful situation is set up globally.
// Tests that seek to test edge cases modify the variables before running.
let mockPayload = {
  sub: "1234567890",
  name: "John Doe",
  admin: true,
};

let AUDIENCE = "CIRCLE_AUTH";
let ISSUER = "CIRCLE_AUTH";
let secret = "a-string-secret-at-least-256-bits-long";
let expiresIn = process.env.TOKEN_EXPIRES_IN;
console.log("expiresIn", expiresIn);

describe("Auth Utility Tests", () => {
  describe("signToken", () => {
    describe("successful token generation", () => {
      test("signs a token producing a string", () => {
        const token = signToken(mockPayload, expiresIn, AUDIENCE, ISSUER);
        expect(typeof token).toBe("string");
      });

      test("signs a token with the expected object payload", () => {
        const token = signToken(mockPayload, expiresIn);
        const decoded = jwt.verify(token, secret, {
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
    });
  });
});
