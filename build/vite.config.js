import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import banner from "vite-plugin-banner";

const inquirer = require("./inquirer");
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
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes("-"),
          },
        },
      }),
    ],
    build: {
      target: "esnext",
      minify: "terser",
      // 库模式打包
      lib: {
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
          // 当设置为 true 时，会保留原有的命名空间，如果它已经存在
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
