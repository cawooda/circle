const puppeteer = require("puppeteer-core");
const puppeteerConfig = require("../puppeteer.config.cjs");
const fs = require("fs").promises;
const path = require("path");

async function convertToPdf(htmlContent, outputPath) {
  try {
    const browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "/opt/render/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome",
      cacheDirectory: puppeteerConfig.cacheDirectory,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();

    // Ensure the directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write the PDF buffer to the specified output path
    await fs.writeFile(outputPath, pdfBuffer);
    await browser.close();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
  return outputPath;
}

module.exports = { convertToPdf };
