const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { authMiddleware } = require("./auth");
const { signToken, verifyToken } = require("./tokenHandler");
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
console.log("expiresIn", expiresIn);

describe("Auth middleware", () => {
  test("returns null user and null token ", async () => {
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
    });
  });
});
