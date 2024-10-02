import AuthService from "./auth";
const VALID_TOKEN = "7dh84jf9fj48fhd74jfdh";

let mockStorage = {};

beforeAll(() => {
  global.Storage.prototype.setItem = jest.fn((key, value) => {
    mockStorage[key] = value;
  });
  global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
});

beforeEach(() => {
  // make sure the fridge starts out empty for each test
  mockStorage = {};
});

afterAll(() => {
  // return our mocks to their original values
  // 🚨 THIS IS VERY IMPORTANT to avoid polluting future tests!
  global.Storage.prototype.setItem.mockReset();
  global.Storage.prototype.getItem.mockReset();
});

describe("getToken", () => {
  test("should return a valid token if valid token is present in localstorage", () => {
    localStorage.setItem("id_token", VALID_TOKEN);
    const result = AuthService.getToken();
    expect(result).toEqual(VALID_TOKEN);
  });
  test("should return null if no token is present", () => {
    const result = AuthService.getToken();
    expect(result).toEqual(null);
  });
});

describe("isTokenExpired", () => {
  test("should return true if ", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Vg30C57s3l90JNap_VgMhKZjfc-p7SoBXaSAy8c28HA";
    const result = AuthService.isTokenExpired(token);
    expect(result).toEqual(true);
  });
  test("should return null if no token is present", () => {
    const token = "sdfs";
    const result = AuthService.isTokenExpired(token);
    expect(result).toEqual(false);
  });
});
