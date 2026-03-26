import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
// 打包产物顶部显示当前产物信息
import banner from "vite-plugin-banner";

const inquirer = require("./inquirer");
// 开发时 打包的入口，默认会去找里面的 index.html
const VITE_URL = path.resolve(__dirname, `../playground`);

export default async (ev) => {
  const result = await inquirer();
  // 打包入口 - 组件文件夹名称
  const entryName = result.plugins;
  // development / production
  const { mode } = ev;
  // 当前组件的版本
  const { version } = require(
    path.resolve(__dirname, `../src/components/${entryName}/package.json`),
  );
  return defineConfig({
    root: VITE_URL,
    plugins: [
      // 打包产物前添加本次打包信息
      banner({
        outDir: path.resolve(__dirname, `../src/components/${entryName}/dist`),
        content: `plugins: ${entryName} * version: v${version} env: ${mode}`,
      }),
      // webcomponent 组件打包
      // 开发环境和线上打包环境都走这个配置
      // 告诉 Vue 编译器，凡是带 - 的标签，一律当作“原生自定义元素（Custom Element）”，而不是 Vue 组件，直接渲染，不参与 Vue 组件解析
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes("-"),
          },
        },
      }),
    ],
    build: {
      // 保留最新语法（箭头函数、class 等），不做降级
      target: "esnext",
      // 使用 Terser 进行压缩
      minify: "terser",
      // 库模式打包
      lib: {
        // 找里面的 index.js 了
        entry: path.resolve(__dirname, `../src/components/${entryName}`),
        formats: ["iife"],
        name: entryName,
        fileName: () => `extension.min.js`,
      },
      // 输出目录
      outDir: path.resolve(__dirname, `../src/components/${entryName}/dist`),
      rollupOptions: {
        output: {
          // 全局变量的名称，可以使用点号来创建命名空间
          name: `Extension.${entryName}`,
          // 如果 window.Extension 已存在，不要覆盖，而是扩展它
          extend: true,
        },
      },
    },
    server: {
      https: true,
      host: "localhost",
      port: 8080,
    },
    optimizeDeps: {
      // 解决vite打包对一些依赖库的编译处理造成的问题
      esbuildOptions: {
        target: "esnext",
      },
    },
    // 别名
    resolve: {
      alias: {
        "@": path.resolve(__dirname, `../src`),
      },
    },
  });
};
