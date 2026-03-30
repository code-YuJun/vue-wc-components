# Extension Loader Runtime (组件加载器运行时)

这是一个轻量级的浏览器端脚本，用于根据页面配置动态地从远程 CDN (unpkg) 加载业务组件资源（JS/CSS），并完成组件的自动注册。

## 🚀 快速接入

在 HTML 页面中引入该加载器脚本，并通过 `data-components` 声明需要加载的组件列表（逗号分隔）：

```html
<script 
  src="./index.js" 
  data-components="demoone,demotwo"
></script>
```

> **注意**：建议对该入口文件设置 `Cache-Control: no-store`，以确保每次页面访问都能获取到最新的组件配置逻辑。

-----

## 🏗 核心架构

该脚本采用 **IIFE (立即调用函数表达式)** 封装，避免污染全局命名空间，其内部逻辑分为四个部分：

  * **并发锁**：确保同一页面多次引入脚本时，核心逻辑仅执行一次。
  * **配置获取 (`fetchMetadata`)**：从服务端接口获取组件的版本、状态等元数据。
  * **动态加载 (`loadExtension`)**：负责创建 DOM 节点加载远程 CSS 和 JS 资源。
  * **生命周期管理 (`init`)**：编排加载任务，并在完成后通过事件通知业务方。

-----

## 🛡 关键机制

### 1\. 运行锁 (`__LOADER_LOCKED__`)

为了防止物理层面上重复插入 `<script>` 标签导致的逻辑重跑，脚本在 `window` 对象上挂载了 `__LOADER_LOCKED__` 标识。

### 2\. 幂等性与异常处理

在加载资源前，脚本会检查页面中是否已存在带有 `data-component` 标识的旧节点。如果存在，会执行 **“先移除后重装”** 的策略，确保环境的干净和版本一致性。

### 3\. 自动注册

JS 资源加载完成后，脚本会自动寻找约定好的全局命名空间：
`window.Extension['{name}-extension'].register()`
如果该方法存在，则立即触发组件的初始化。

-----

## 🔄 执行流程

1.  **解析参数**：从 `document.currentScript` 获取用户指定的组件名。
2.  **获取清单**：请求 `CONFIG_API` 获取所有可用组件的最新版本号及启用状态。
3.  **交集过滤**：仅针对“用户需要”且“配置系统中开启”的组件启动加载任务。
4.  **并行加载**：使用 `Promise.allSettled` 并行加载所有组件的 `.css` 和 `.min.js`。
5.  **触发通知**：所有任务结束后，抛出全局事件 `extension-ready`。

-----

## 🛠 技术细节说明

### 配置接口格式

接口 `http://localhost:8080/components` 预期返回：

```json
{
  "components": [
    { "name": "demoone", "version": "1.0.2", "enabled": true },
    { "name": "demotwo", "version": "2.1.0", "enabled": false }
  ]
}
```

### 资源路径规则

脚本遵循特定的目录规范从 **unpkg** 抓取资源：

  * **CSS**: `https://unpkg.com/{name}-extension@{version}/dist/style.css`
  * **JS**: `https://unpkg.com/{name}-extension@{version}/dist/extension.min.js`

### 监听加载完成

业务代码可以通过以下方式监听组件加载状态：

```javascript
window.addEventListener('extension-ready', (e) => {
  console.log('已加载的组件:', e.detail.loadedComponents);
});
```