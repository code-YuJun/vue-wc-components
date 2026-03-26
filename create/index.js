/**
 * 创建 webcomponent 插件
 */
// 命令行操作
const inquirer = require("inquirer");
// 在 Node.js 终端输出带颜色和样式的文本
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const BASE_URL = path.resolve(__dirname, '../src/components');

// 请输入插件名称
function inputPluginName() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "请输入插件名称",
      default: "",
      validate: async (input) => {
        if (!input.match(/^[a-z]+$/)) {
          return "请输入英文小写字母";
        } else {
          return true;
        }
      },
    },
  ]);
}

// 同步检查指定路径下的文件是否存在
function fsExistSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist, callback) {
  fs.access(dist, function (err) {
    if (err) {
      // 目录不存在时创建目录
      fs.mkdirSync(dist);
    }
    _copy(null, src, dist);
  });
  function _copy(err, src, dist) {
    if (err) {
      callback(err);
    } else {
      fs.readdir(src, function (err, paths) {
        if (err) {
          callback(err);
        } else {
          paths.forEach(function (path) {
            var _src = src + "/" + path;
            var _dist = dist + "/" + path;
            fs.stat(_src, function (err, stat) {
              if (err) {
                callback(err);
              } else {
                // 判断是文件还是目录
                if (stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src));
                } else if (stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback);
                }
              }
            });
          });
        }
      });
    }
  }
}

/**
 * 方法说明 替换一个文件夹下所有文件中的特定字符串，不包含子文件夹
 * @name dirContentReplace
 * @param {str} filePath 文件所在路径
 * @param {Array} replaceObj 模版替换的数组 { key: 模版占位符, value: 替换值 }
 * @return {none}
 * @note 话说这个js里函数套函数的格式好难看啊，不知道怎么优化，继续深入学习吧
 */
function dirContentReplace(filePath, replaceObj) {
  //readdir方法读取文件名
  fs.readdir(filePath, "utf8", function (err, files) {
    if (err) return console.log(chalk.red(err));
    files.forEach((item) => {
      var itemPath = path.join(filePath, item);
      fs.stat(itemPath, function (err, stat) {
        if (err) {
          console.log(chalk.red(err));
        } else {
          // 判断是文件还是目录
          if (stat.isFile()) {
            //readFile方法读取文件内容
            fs.readFile(itemPath, "utf8", function (err, data) {
              let result = data;
              replaceObj.forEach((item) => {
                result = result.replace(
                  new RegExp("\\" + item.key, "g"),
                  item.value
                );
              })
              //writeFile改写文件内容
              fs.writeFile(itemPath, result, "utf8", function (err) {
                if (err) return console.log(chalk.red(err));
              });
            });
          } else if (stat.isDirectory()) {
            // 当是目录是，递归复制
            dirContentReplace(itemPath, replaceObj);
          }
        }
      });
    });
  });
}

async function run() {
  // 获取组件名称
  const { name } = await inputPluginName();
  // 组件生成的目标文件夹   
  const targetDir = path.resolve(BASE_URL, `${name}-extension`);
  // 模版文件夹
  const templateDir = path.resolve(__dirname, '../template');
  console.log(chalk.blue("开始创建组件！"));
  const hasTargetDir = fsExistSync(targetDir);
  // 如果这个组件已经创建过了
  if (hasTargetDir) {
    console.error("该插件已存在！");
    process.exit(1);
  }
  console.log(chalk.blue("开始创建目标文件夹！"));
  // 创建文件夹
  fs.mkdirSync(targetDir);
  console.log(chalk.blue("开始复制模版！"));
  copyDir(templateDir, targetDir, (error) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  });
  console.log(chalk.blue("开始修改模版！"));
  setTimeout(() => {
    dirContentReplace(targetDir, [
      { key: '$name', value: name },
    ]);
    console.log(chalk.blue("创建完成！"));
  }, 1000);
}

run();