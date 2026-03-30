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

## 将Vue组件封装为Web Component
https://juejin.cn/post/7072715334519619598
