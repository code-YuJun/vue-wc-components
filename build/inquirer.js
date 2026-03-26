/*
 * 打包哪个插件
 */
var inquirer = require("inquirer");
var fs = require("fs");
var path = require("path");

module.exports = function () {
  // 所有的组件
  const entryArr = fs.readdirSync(
    path.resolve(__dirname, `../src/components`)
  );
  // 可选
  return inquirer.prompt([
    {
      type: "list",
      name: "plugins",
      message: `打包哪个插件?`,
      choices: entryArr,
      default: 0,
    },
  ]);
};