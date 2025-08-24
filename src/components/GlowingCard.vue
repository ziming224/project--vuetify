<template>
  <v-card class="glowing-card" v-bind="$attrs">
    <slot />
  </v-card>
</template>

<script setup>
  defineOptions({
    inheritAttrs: false,
  })
</script>

<style>
/* @property 是 CSS Houdini 的一部分，需要放在非 scoped 的 style 標籤中才能全域註冊 */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

.glowing-card {
  --angle: 0deg; /* 舊版瀏覽器的備用值 */
  border: 4px solid;
  /* 使用你主題中的顏色來建立漸層，並重複第一個顏色讓漸層無縫銜接 */
  border-image: conic-gradient(from var(--angle), #c1e9da, #f3f5e6, #f0d585, #bbdcd0) 1;
  animation: 5s rotate linear infinite;

}
</style>
