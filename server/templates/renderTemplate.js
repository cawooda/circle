const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const renderTemplate = (data, templateName) => {
  const templatePath = path.join(__dirname, `${templateName}.ejs`);
  const templateString = fs.readFileSync(templatePath, "utf-8");
  return ejs.render(templateString, data);
};

module.exports = { renderTemplate };
