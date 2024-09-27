const puppeteer = require("puppeteer");
const puppeteerConfig = require("../puppeteer.config.cjs");
const fs = require("fs").promises;
const path = require("path");
const { renderTemplate } = require("../templates/renderTemplate");

async function convertToPdf(htmlContent, fileName) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();

    // Ensure the directory exists
    await fs.mkdir(path.dirname(fileName), { recursive: true });
    // Write the PDF buffer to the specified output path
    await fs.writeFile(fileName, pdfBuffer);
    await browser.close();
    return fileName;
  } catch (error) {
    //enrich the error message to be more helpful. if (error.code === '3433' throw new wrror(''))
    console.error("Error generating PDF:", error.message);
    throw error;
  }
}

module.exports = { convertToPdf };
