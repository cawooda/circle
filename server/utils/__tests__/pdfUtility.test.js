const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
const { convertToPdf } = require("../pdfUtility");

// Mock the puppeteer module
jest.mock("puppeteer");
jest.mock("fs").promises;
jest.mock("path");

describe("convertToPdf", () => {
  let mockBrowser, mockPage, mockPdfBuffer;

  beforeEach(() => {
    // Setup mocks
    mockPdfBuffer = Buffer.from("pdf content");

    mockPage = {
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(mockPdfBuffer),
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    puppeteer.launch.mockResolvedValue(mockBrowser);
    fs.mkdir.mockResolvedValue(undefined);
    fs.writeFile.mockResolvedValue(undefined);
    path.dirname.mockReturnValue("/mock/output/directory");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a PDF and save it to the specified output path", async () => {
    const htmlContent = "<html><body>Hello, World!</body></html>";
    const outputPath = "/mock/output/path.pdf";

    const result = await convertToPdf(htmlContent, outputPath);

    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
    expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
    expect(mockPage.setContent).toHaveBeenCalledWith(htmlContent);
    expect(mockPage.pdf).toHaveBeenCalledTimes(1);
    expect(fs.mkdir).toHaveBeenCalledWith("/mock/output/directory", {
      recursive: true,
    });
    expect(fs.writeFile).toHaveBeenCalledWith(outputPath, mockPdfBuffer);
    expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    expect(result).toBe(outputPath);
  });

  it("should handle errors and log them", async () => {
    const htmlContent = "<html><body>Error Test</body></html>";
    const outputPath = "/mock/output/error.pdf";
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    puppeteer.launch.mockRejectedValue(new Error("Failed to launch Puppeteer"));

    const result = await convertToPdf(htmlContent, outputPath);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error generating PDF:",
      expect.any(Error)
    );
    expect(result).toBe(outputPath);

    consoleErrorSpy.mockRestore();
  });
});
