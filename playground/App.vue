<!-- 
 组件库演练场：本地开发的时候使用
-->
<script setup>
import { register } from '@/extension/webComponent/aihelper-extension-videoplayer';
register()
</script>

<template>
    <aihelper-extension-videoplayer></aihelper-extension-videoplayer>
</template>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
