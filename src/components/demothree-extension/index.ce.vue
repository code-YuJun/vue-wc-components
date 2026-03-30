<script setup lang='ts'>
import { onMounted } from 'vue'
onMounted(() => {
  console.log('这里是 demo-three');
})
</script>

<template>
  <div class="demothree">这里是 demo-three</div>
</template>

<style>
.demothree {
  background-color: green;
}
</style>