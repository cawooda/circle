// Import the necessary modules and dependencies
const path = require("path");
const dayjs = require("dayjs");
const { generateRandomNumber } = require("../utils/helpers");
const { convertToPdf } = require("../utils/pdfUtility");
const { EMAILService } = require("../utils/mailer");
const { renderTemplate } = require("../templates/renderTemplate");

const { User, Product, ServiceAgreement } = require("../models"); // Correct model name
const resolvers = require("./resolvers");

console.log(resolvers);

// Jest automatically mocks these modules so that we control their behavior in tests
jest.mock("../utils/helpers");
jest.mock("../utils/pdfUtility");
jest.mock("../utils/mailer");
jest.mock("../models");
jest.mock("../templates/renderTemplate");
jest.mock("../utils/smsService", () => {
  return {
    SMSService: jest.fn().mockImplementation(() => {
      return {
        sendMessage: jest.fn(),
      };
    }),
  };
});

describe("Resolvers", () => {
  let mockContext;

  beforeEach(() => {
    mockContext = {
      user: {
        _id: "66a083826e76d0e5ababe48f",
        roleProvider: { _id: "66a0d9f4a0eb8627cc6320f7" },
      },
    };

    const mockAgreements = [
      {
        _id: "66a0d9f4a0eb8627cc6320f9",
        provider: "66a0d9f4a0eb8627cc6320f7",
        customer: "66a083826e76d0e5ababe491",
        product: "66a0d9f4a0eb8627cc6321f1",
      },
    ];

    const mockPopulate = jest.fn().mockReturnThis();
    const mockExec = jest.fn().mockResolvedValue(mockAgreements);

    ServiceAgreement.find = jest.fn(() => ({
      populate: mockPopulate,
      exec: mockExec,
    }));

    EMAILService.mockImplementation(() => {
      return {
        sendEmail: jest.fn(),
      };
    });

    renderTemplate.mockReturnValue("mockRenderedTemplate");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getServiceAgreements", () => {
    it("should return service agreements successfully", async () => {
      const mockUser = {
        _id: "66a083826e76d0e5ababe48f",
        roleProvider: "66a0d9f4a0eb8627cc6320f7",
        roleCustomer: "66a0d9f4a0eb8627cc6320f4",
        populate: jest.fn().mockResolvedValue(),
      };

      const mockAgreements = [
        {
          _id: "66a0d9f4a0eb8627cc6320f9",
          provider: "66a0d9f4a0eb8627cc6320f7",
          customer: "66a083826e76d0e5ababe491",
          product: "66a0d9f4a0eb8627cc6321f1",
        },
      ];

      User.findById.mockResolvedValue(mockUser);
      ServiceAgreement.find.mockResolvedValue(mockAgreements);

      const result = await resolvers.Query.getServiceAgreements(
        null,
        { userId: "66a083826e76d0e5ababe48f" },
        mockContext
      );

      expect(User.findById).toHaveBeenCalledWith("66a083826e76d0e5ababe48f");
      expect(ServiceAgreement.find).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: "service agreements found successfully",
        serviceAgreements: mockAgreements,
      });
    });

    it("should return an error response if something goes wrong", async () => {
      const mockError = new Error("Failed to find agreements");
      User.findById.mockRejectedValue(mockError);

      const result = await resolvers.Query.getServiceAgreements(
        null,
        { userId: "66a083826e76d0e5ababe48f" },
        mockContext
      );

      expect(result).toEqual({
        success: false,
        message: "service agreements find not successful",
        error: mockError,
      });
    });
  });

  describe("addServiceAgreement", () => {
    it("should add a new service agreement", async () => {
      const mockProduct = { _id: "66a0d9f4a0eb8627cc6321f1", price: 100.14 };
      const mockAgreement = {
        _id: "66a0d9f4a0eb8627cc6320f9",
        populate: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue(),
        customer: {
          user: {
            sendMessage: jest.fn(),
          },
        },
        provider: { providerName: "Acme Electronics" },
        agreementNumber: "12345",
      };

      Product.findById.mockResolvedValue(mockProduct);
      ServiceAgreement.create.mockResolvedValue(mockAgreement);

      const result = await resolvers.Mutation.addServiceAgreement(
        null,
        {
          provider: "66a0d9f4a0eb8627cc6320f7",
          customer: "66a083826e76d0e5ababe491",
          startDate: new Date(),
          quantity: 2,
          product: "66a0d9f4a0eb8627cc6321f1",
          endDate: new Date(),
          signature: "mockSignature",
        },
        mockContext
      );

      expect(Product.findById).toHaveBeenCalledWith("66a0d9f4a0eb8627cc6321f1");
      expect(ServiceAgreement.create).toHaveBeenCalledWith({
        provider: "66a0d9f4a0eb8627cc6320f7",
        customer: "66a083826e76d0e5ababe491",
        startDate: expect.any(Date),
        product: mockProduct,
        quantity: 2,
        endDate: expect.any(Date),
        providerSignature: "mockSignature",
      });

      expect(mockAgreement.customer.user.sendMessage).toHaveBeenCalled();

      expect(result).toEqual(mockAgreement);
    });

    it("should throw an error if provider is not in context", async () => {
      await expect(
        resolvers.Mutation.addServiceAgreement(
          null,
          {
            provider: "anotherProviderId",
            customer: "66a083826e76d0e5ababe491",
            startDate: new Date(),
            quantity: 2,
            product: "66a0d9f4a0eb8627cc6321f1",
            endDate: new Date(),
            signature: "mockSignature",
          },
          mockContext
        )
      ).rejects.toThrow("provider is not in context. not valid");
    });
  });
});
