const html_to_pdf = require("html-pdf-node");
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

const convertToPdf = async (content, outputPath) => {
  let options = { format: "A4", path: outputPath };
  let file = { content: content };

  try {
    await html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      console.log("PDF Buffer:-", pdfBuffer);
    });

    console.log("outputPath", outputPath);
    return outputPath;
  } catch (error) {
    return null;
    console.log(error);
  }

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
