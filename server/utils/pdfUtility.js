const puppeteer = require("puppeteer-core");
const puppeteerConfig = require("../puppeteer.config.cjs");

const fs = require("fs").promises;
const path = require("path");

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

async function convertToPdf(htmlContent, outputPath) {
  try {
    const browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "/opt/render/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux/chrome",
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
    console.log(error);
  }
  return outputPath;
}

// Example usage:
// convertToPdf('<h1>Hello World</h1>', './output/test.pdf')
//   .then(() => console.log('PDF generated successfully'))
//   .catch(err => console.error('Error generating PDF:', err));

module.exports = convertToPdf;

module.exports = { convertToPdf };
