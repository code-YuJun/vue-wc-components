# vue-wc-components

一个基于 Vue 3 开发的 Web Components 组件库，提供可在任何框架中使用的自定义元素。

## 特性

- ✅ 基于 Vue 3 开发的 Web Components
- ✅ 可在任何框架中使用（React、Angular、Vue 等）
- ✅ 支持组件自定义和扩展
- ✅ 现代化的开发流程
- ✅ 响应式设计

## 安装

### 克隆仓库

```bash
git clone https://github.com/code-YuJun/vue-wc-components.git
cd vue-wc-components
npm install
```

## 快速开始

### 创建新组件

```bash
npm run create
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
vue-wc-components/
├── build/            # 构建配置
│   ├── inquirer.js   # 组件创建交互配置
│   └── vite.config.js # Vite 配置
├── create/           # 组件创建脚本
│   └── index.js      # 组件创建主脚本
├── playground/       # 开发环境测试
│   ├── App.vue       # 测试应用
│   ├── index.html    # 入口 HTML
│   └── main.js       # 入口脚本
├── src/              # 源代码
│   ├── api/          # API 相关
│   ├── assets/       # 静态资源
│   ├── components/   # 组件目录
│   ├── hooks/        # 自定义 hooks
│   ├── style/        # 样式文件
│   └── utils/        # 工具函数
├── template/         # 组件模板
├── package.json      # 项目配置
└── readme.md         # 项目说明
```

## 组件使用

### 基本使用

1. 构建组件：

```bash
npm run build
```

2. 在 HTML 中引入组件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue WC Components</title>
    <link rel="stylesheet" href="./style.css" />
    <script src="./extension.min.js"></script>
</head>
<body>
    <script>
        // 注册组件
        window.Extension["demo-extension"].register();
    </script>
    <demo-extension></demo-extension>
</body>
</html>
```

### 在框架中使用

#### Vue 3

```js
  // demo
  reloadWebCpn(name, version, key) {
    try {
      const link = document.createElement("link");
      link.href = `/${name}@${version}/dist/style.css`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = `/${name}@${version}/dist/extension.min.js`;
      script.onload = () => {
        window.Extension && window.Extension[key] && window.Extension[key].register();
        // key和name同时存在且不同，嗅探命名空间下另一属性能否注册（兼容逻辑）
        if (key !== name) {
          window.Extension && window.Extension[name] && window.Extension[name].register();
        }
        const element = document.createElement(name);
        document.body.appendChild(element);
      };
      script.onerror = () => {
        console.log("加载失败");
      };
      document.body.appendChild(script);
    } catch (err) {
      console.log(err);
    }
  }
```

## 开发指南

### 创建新组件

使用内置的组件创建命令：

```bash
npm run create
```

按照提示输入组件名称和描述，系统会自动生成组件模板。

### 组件结构

每个组件包含以下文件：

- `index.ce.vue` - 组件的 Vue 单文件组件
- `index.js` - 组件的注册和导出
- `common.css` - 组件的样式
- `package.json` - 组件的配置

### 开发流程

1. 创建新组件：`npm run create`
2. 开发组件：修改 `src/components/{component-name}/index.ce.vue`
3. 测试组件：运行 `npm run dev` 查看效果
4. 构建组件：运行 `npm run build` 生成生产版本

## 技术栈

- **框架**：Vue 3
- **构建工具**：Vite
- **HTTP 客户端**：Axios
- **样式**：SCSS

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

ISC License

## 联系方式

- GitHub: [code-YuJun/vue-wc-components](https://github.com/code-YuJun/vue-wc-components)
- Issues: [https://github.com/code-YuJun/vue-wc-components/issues](https://github.com/code-YuJun/vue-wc-components/issues)
