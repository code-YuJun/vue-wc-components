/*
 * 打包哪个插件
 */
var inquirer = require("inquirer");
var fs = require("fs");
var path = require("path");

module.exports = function (type) {
  const entryArr = fs.readdirSync(
    path.resolve(__dirname, `../src/components/${type}`)
  );
  return inquirer.prompt([
    {
      type: "list",
      name: "plugins",
      message: `打包哪个${type}插件?`,
      choices: entryArr,
      default: 0,
    },
  ]);
};