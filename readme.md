# vue-wc-components

基于 Vue 3.2 的 `defineComponent` + `defineCustomElement` 构建的 Web Components 组件库，支持在任意前端框架（Vue / React / 原生 HTML）中使用。

---

## ✨ 特性

* 基于 Vue 3 Composition API
* 输出标准 Custom Elements（浏览器原生支持）
* 支持跨框架使用（Vue / React / Angular / HTML）
* 支持按需加载
* Shadow DOM 样式隔离
* 支持打包为 npm 包或 CDN 直接引入

---

## 📦 安装

```bash
npm install your-lib-name
```

或通过 CDN：

```html
<script type="module" src="https://unpkg.com/your-lib-name/dist/index.es.js"></script>
```

---

## 🚀 快速开始

### 1. 注册组件

```ts
import { defineCustomElement } from 'vue'
import MyButton from './components/MyButton'

const MyButtonElement = defineCustomElement(MyButton)

if (!customElements.get('my-button')) {
  customElements.define('my-button', MyButtonElement)
}
```

---

### 2. 使用组件

```html
<my-button label="Click me"></my-button>
```

---

## 🧩 示例组件

```ts
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'MyButton',
  props: {
    label: String
  },
  setup(props) {
    return () => h('button', props.label)
  }
})
```

---

## 📁 项目结构

```
src/
 ├─ components/
 │   ├─ Button/
 │   │   ├─ Button.ts
 │   │   └─ index.ts
 │
 ├─ register-all.ts
 ├─ register-on-demand.ts
 └─ main.ts
```

---

## 🔧 按需注册

```ts
export function registerButton() {
  if (!customElements.get('my-button')) {
    customElements.define(
      'my-button',
      defineCustomElement(Button)
    )
  }
}
```

---

## 🎨 样式说明

默认使用 Shadow DOM：

```ts
defineCustomElement(Component, {
  styles: [`
    button {
      color: red;
    }
  `]
})
```

> 注意：Shadow DOM 会隔离样式，外部 CSS 无法直接影响组件内部

---

## 🔁 Props & Events

### Props

```html
<my-button label="hello"></my-button>
```

或：

```js
const el = document.querySelector('my-button')
el.label = 'hello'
```

---

### Events

组件内部：

```ts
emit('click')
```

外部监听：

```js
el.addEventListener('click', () => {
  console.log('clicked')
})
```

---

## 📦 打包配置（Vite）

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/register-all.ts',
      name: 'MyWebComponents',
      fileName: 'my-wc',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue']
    }
  }
})
```

---

## ⚠️ 注意事项

### 1. Vue 版本要求

必须使用 Vue >= 3.2

---

### 2. 自定义元素命名规范

必须包含 `-`

```html
<my-button></my-button> ✅
<mybutton></mybutton> ❌
```

---

### 3. 避免重复注册

```ts
if (!customElements.get('my-button')) {
  customElements.define('my-button', MyButtonElement)
}
```

---

### 4. 属性类型限制

HTML 属性仅支持字符串：

```html
<my-comp data='{"a":1}'></my-comp>
```

需在组件内手动解析：

```ts
JSON.parse(props.data)
```

---

## 🧱 构建模式建议

建议提供两种构建方式：

| 模式       | 说明                         |
| -------- | -------------------------- |
| full     | 包含 Vue runtime，适用于非 Vue 项目 |
| external | 不包含 Vue，适用于 Vue 项目         |

---

## 📌 使用场景

* 跨框架组件库
* 微前端组件共享
* Design System 基础组件
* 插件化 UI 组件（浏览器扩展 / Electron）

---

## 📄 License

MIT
