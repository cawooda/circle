const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const convertToPdf = async (html, outputPath) => {
  try {
    ensureDirectoryExistence(outputPath);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: outputPath, format: "A4" });
    await browser.close();
    return outputPath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

module.exports = { convertToPdf };
