import { isNumber } from "./helpers";

describe("isNumber", () => {
  test("should return true if passed an integer", () => {
    const result = isNumber("42");
    expect(result).toEqual(true);
  });
  test("should return false if given a string with a letter", () => {
    const result = isNumber("42a");
    expect(result).toEqual(false);
  });
  test("should return true if given a number", () => {
    const result = isNumber(42);
    expect(result).toEqual(true);
  });
});
