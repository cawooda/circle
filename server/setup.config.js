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

module.exports = {
  addProviderDirectory,
  projectStartUp: () => {
    checkDirectory();
  },
};
