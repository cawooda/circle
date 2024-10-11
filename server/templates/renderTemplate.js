const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const renderTemplate = (data, templateName) => {
  try {
    console.log(data);
    const templatePath = path.join(__dirname, `${templateName}.ejs`);
    const templateString = fs.readFileSync(templatePath, "utf-8");
    return ejs.render(templateString, data);
  } catch (error) {
    console.log(error);
    throw new Error("an error happended in render template", error);
  }
};

module.exports = { renderTemplate };
