require("dotenv").config();
const path = require("path");
const fs = require("fs");

const CUSTOMER_DATA_FOLDER = "customerData";
const AGREEMENTS_FOLDER = "agreements";
const directory = path.join(__dirname, CUSTOMER_DATA_FOLDER, AGREEMENTS_FOLDER);

function checkDirectory() {
  try {
    const directoryExists = fs.existsSync(directory);
    if (!directoryExists) {
      fs.mkdirSync(directory, { recursive: true });
    }
  } catch (error) {
    console.log(
      `Setup.config.fs projectStartup function errored which most ${error}`
    );
  }
  return directory;
}

function addProviderDirectory(name) {
  try {
    const baseDirectory = checkDirectory();
    const fullDirectory = path.join(baseDirectory, name);
    const directoryExists = fs.existsSync(fullDirectory);
    if (!directoryExists) {
      fs.mkdirSync(fullDirectory, { recursive: true });
    }
    return fullDirectory;
  } catch (error) {
    console.log(
      `Setup.config.fs projectStartup function errored which most ${error}`
    );
  }
}

const puppeteer = require("puppeteer");
const { renderTemplate } = require("./templates/renderTemplate");

const checkHeadlessChrome = async () => {
  try {
    // Launch Puppeteer in headless mode
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Example data to render the template
    const data = {
      title: "Test Template",
      message: "This is a test message from Puppeteer!",
    };

    // Render the template with data
    const renderedHtml = renderTemplate(data, "./checkingHeadless"); // Adjust file name

    // Load the rendered HTML into Puppeteer
    await page.setContent(renderedHtml);

    // Capture a screenshot to verify the content rendered properly
    await page.screenshot({ path: "rendered_template.png" });

    console.log("Puppeteer test executed successfully!");
    await browser.close();
  } catch (error) {
    console.error("Error running Puppeteer test:", error);
    process.exit(1); // Exit with failure if the test fails
  }
};

module.exports = {
  addProviderDirectory,
  projectStartUp: () => {
    checkDirectory();
    checkHeadlessChrome();
  },
};
