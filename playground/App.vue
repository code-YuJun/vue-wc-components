<!-- 
 组件库演练场：本地开发的时候使用
-->
<script setup>
import { register } from '@/components/demo-extension';
register()
</script>

<template>
    <demo-extension title="标题" :count="123"/>
</template>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
