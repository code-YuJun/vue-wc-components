import { defineCustomElement } from 'vue'
// vue在默认情况下，以.ce.vue 结尾的文件将以Web Component导入
import demo from './index.ce.vue'
import './common.css';

// Vue 从组件定义生成一个新的 HTML 元素类
export const CustomElement = defineCustomElement(demo)

// 注册自定义元素
export function register () {
  customElements.define('demo-extension', CustomElement)
}