<script setup lang='ts'>
import { onMounted } from 'vue'
onMounted(() => {
  console.log('这里是 demo-two');
})
</script>

<template>
  <div class="demotwo">这里是 demo-three</div>
</template>

<style>
.demotwo {
  background-color: yellow;
}
</style>