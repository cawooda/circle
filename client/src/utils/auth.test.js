// Mock global localStorage before importing AuthService
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

import AuthService from "./auth"; // Import AuthService after mocking localStorage
import jwtDecode from "jwt-decode";

// Mock the jwtDecode function directly
jest.mock("jwt-decode");

describe("getProfile", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean slate
    localStorage.getItem.mockClear();
    jwtDecode.mockClear();
  });

  test("should return decoded profile if token is valid", () => {
    const mockToken = "validToken";
    const mockProfile = { id: "user1", name: "John Doe" };

    localStorage.getItem.mockReturnValue(mockToken);

    jwtDecode.mockReturnValue(mockProfile);

    const profile = AuthService.getProfile();

    expect(profile).toEqual(mockProfile);
  });
});
