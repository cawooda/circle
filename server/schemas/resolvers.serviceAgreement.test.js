require("dotenv").config();
const { resolvers } = require("../schemas/resolvers.serviceAgreement");

const User = require("../models/User");
const ServiceAgreement = require("../models/ServiceAgreement"); // Adjust the path

jest.mock("../models/User");
jest.mock("../models/ServiceAgreement");

describe("resolvers.getServiceAgreements", () => {
  let context;

  beforeEach(() => {
    context = {
      user: {
        _id: "66a083826e76d0e5ababe48f",
        roleProvider: "66a0d9f4a0eb8627cc6320f7",
      },
    };
  });

  test("should return service agreements for a valid user", async () => {
    // Arrange: Mock user and service agreements
    const mockUser = {
      _id: "66a083826e76d0e5ababe48f",
      roleProvider: "66a0d9f4a0eb8627cc6320f7",
      roleCustomer: "mockCustomerId",
      populate: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(mockUser);
    ServiceAgreement.find.mockResolvedValue([
      { agreementId: "1" },
      { agreementId: "2" },
    ]);

    // Act: Call the resolver
    const result = await resolvers.Query.getServiceAgreements(
      null,
      { userId: mockUser._id },
      context
    );

    // Assert: Check the response structure
    expect(result).toEqual({
      success: true,
      message: "service agreements found successfully",
      serviceAgreements: [{ agreementId: "1" }, { agreementId: "2" }],
    });
    expect(User.findById).toHaveBeenCalledWith(context.user._id); // Verify the user lookup
    expect(ServiceAgreement.find).toHaveBeenCalledWith({
      $or: [
        { provider: mockUser.roleProvider },
        { customer: mockUser.roleCustomer },
      ],
    });
  });
});
