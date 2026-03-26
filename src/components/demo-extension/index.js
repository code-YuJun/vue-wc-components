import { defineCustomElement } from 'vue'
import demo from './index.ce.vue'
import './common.css';

// Vue 从组件定义生成一个新的 HTML 元素类
export const CustomElement = defineCustomElement(demo)

// 注册自定义元素
export function register () {
  customElements.define('demo-extension', CustomElement)
}