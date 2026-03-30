<script setup lang='ts'>
import { onMounted } from 'vue'
onMounted(() => {
  console.log('这里是 demo-one');
})
</script>

<template>
  <div class="demoone">这里是 demo-one</div>
</template>

<style>
.demoone {
  background-color: red;
}
</style>