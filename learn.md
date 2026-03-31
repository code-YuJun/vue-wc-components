## 为什么要学习 webComponent
需要给多个前端业务场景/团队提供一个公共的组件，不限制框架，并且父页面不能影响组件的样式和逻辑。组件也不能影响父页面的样式和逻辑。需要考虑 隔离 DOM 和 CSS。

## webComponent
MDN 定义：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components
- Custom element（自定义元素）
- Shadow DOM（影子 DOM）保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
- HTML template（HTML 模板）
```html
<!-- 定义一个模板节点，template 不会直接渲染到页面 -->
<template id="card-template">
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
// 继承原生 HTMLElement，表示这是一个自定义 HTML 元素
class MyCard extends HTMLElement {
  constructor() {
    super()
    // 创建 Shadow DOM，this 指当前 <my-card> 实例，
    /**
     * 参数	作用
        open	外部可以通过 el.shadowRoot 访问
        closed	外部访问不到
     */
    const shadow = this.attachShadow({ mode: 'open' })
    // 从主文档中获取 <template>，
    const tpl = document.getElementById('card-template')
    // 取 template 里的真实 DOM
    shadow.appendChild(tpl.content.cloneNode(true))
  }
}
// 注册自定义元素 <my-card>，之后浏览器遇到这个标签时，会自动 new MyCard()
customElements.define('my-card', MyCard)
</script>
<my-card>
  <p>Hello</p>
</my-card>
```

## 为什么 shadow DOM 能够实现 隔离 DOM 和 CSS
https://chatgpt.com/s/t_69c51808ca4081918115721a94bf97a5

特性：Shadow DOM 本质是一个“独立的 DOM 子树 + 独立的作用域边界”，浏览器在实现上给它加了一层“作用域隔离规则”，从而实现 CSS 和（部分）DOM 的隔离。

CSS 选择器不会“穿透 shadow boundary”，内部不污染外部。
```css
/* 可以理解为浏览器做了类似这样的事情,每个 ShadowRoot 都有一个“作用域 ID” */
:host p { ... }
```
DOM 查询被隔离, ```document.querySelector('p')``` 拿不到 shadow DOM 内的 <p>，必须 ```this.shadowRoot.querySelector('p')```


## 常见的原生 webComponent 组件是什么
<video>（以及 <input>、<select> 等）底层确实用了 Shadow DOM
1. 打开 DevTools（F12）
2. 右上角 ⚙️（Settings）
3. 显示用户代理 Shadow DOM

## 为什么没用原生的 shadow DOM 去开发
真实的业务需求开发中，组件可能很复杂，导致使用原生的 webComponent 开发效率太低，所以考虑使用 Vue3 的代码开发，打包成一个 webComponent 原生组件

## npm 发包
- npm login
- npm publish
有改动的时候，需要升级版本，发包，不能在原来的基础上再次发包。

## unpkg 链接访问发布的包的资源
unpkg 本质上就是一个 基于 npm 的 CDN（内容分发网络）服务，组件发包之后，需要有缓存。
https://unpkg.com/yujun-xrequest@0.0.0/dist/index.js

## 为什么要有 loader.js 文件
如果没有 loader.js，接入的页面要接入多个组件的时，需要手动引入所有的组件的 CSS 和 JS 资源，如果有了 loader.js 之后，接入页面只需要引入 loader.js 一个文件，然后配置自己需要的组件即可，减少接入成本。

## 为什么需要有配置系统
组件发布到了 npm 之后，loader.js 需要拿到组件最新的元信息（名称、版本号），从而获取最新的组件内容，所以此时需要 loader.js 去调用一个配置系统的接口。发布 npm 包之后，需要将组件的信息同步到配置系统中。

## 配置系统如何设计

## loader.js 里需要干什么

## loader.js 和 组件资源 的缓存问题

## 如果在一个页面中加载了多个 loader.js 应该如何处理

## 接入方页面如何挂载组件