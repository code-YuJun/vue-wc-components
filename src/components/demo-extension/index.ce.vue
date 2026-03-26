<script setup lang="ts">
import { onMounted, ref } from "vue";
import { get } from "@/api/http";
import { useToggle } from "@/hooks/useToggle.js";
import { compareVersion } from '@/utils'
const data = ref(null);
const { state, toggle, setTrue, setFalse } = useToggle();
onMounted(() => {
  get("/users")
    .then((res: any) => {
      console.log("res", res);
      data.value = res;
    })
    .catch((err) => {
      console.log("进来了");
      console.log(err);
    });
});
</script>

<template>
  <div>
    <div>图片展示：</div>
    <div>
      <img src="@/assets/img/github.jpeg" />
    </div>
    <div>调用接口：</div>
    <div>{{ data }}</div>
    <div>hooks：</div>
    <button @click="toggle">点击按钮</button>
    <div>{{ state }}</div>
    <div>utils：</div>
    <div>
      {{ compareVersion("1.1.1", "1.2.1") }}
    </div>
  </div>
</template>

<style>
/* CSS 资源引入 */
@import './common.css';
</style>