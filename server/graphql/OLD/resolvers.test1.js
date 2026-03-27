const { User } = require("../../models");
const resolverModule = require("../resolvers.user");

jest.mock("../models", () => ({
  User: {
    findById: jest.fn(),
    find: jest.fn(),
  },
}));

const getMe =
  resolverModule?.Query?.getMe || resolverModule?.getMe || resolverModule;

describe("getMe resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
});

it("returns a user when context.user exists", async () => {
  const fakeUser = {
    _id: "user-1",
    roleAdmin: { users: [] },
    roleProvider: { linkedCustomers: [], services: [] },
    save: jest.fn().mockResolvedValue(true),
  };
  const query = {
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(fakeUser),
  };

  User.findById.mockReturnValue(query);
  User.find.mockResolvedValue([]);

  const context = {
    user: { _id: "user-1" },
    token: "fake-token",
  };

  const result = await getMe(null, {}, context);

  expect(User.findById).toHaveBeenCalledWith("user-1");
  expect(result).toBeTruthy();
});
