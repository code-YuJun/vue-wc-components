<!-- 
 组件库演练场：本地开发的时候使用
-->
<script setup>
import { register } from '@/components/demotwo-extension';
register()
</script>

<template>
    <demotwo-extension />
</template>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
