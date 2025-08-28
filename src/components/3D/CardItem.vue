<template>
  <component
    :is="as"
    ref="cardItemRef"
    :class="['absolute h-full w-full rounded-xl', $props.class]"
    :style="{
      transition: 'transform 0.25s ease-out',
    }"
  >
    <slot />
  </component>
</template>

<script setup>
  import { inject, onMounted, ref, watch } from 'vue'

  const props = defineProps({
    as: {
      type: String,
      default: 'div',
    },
    class: String,
    translateX: {
      type: [Number, String],
      default: 0,
    },
    translateY: {
      type: [Number, String],
      default: 0,
    },
    translateZ: {
      type: [Number, String],
      default: 0,
    },
    rotateX: {
      type: [Number, String],
      default: 0,
    },
    rotateY: {
      type: [Number, String],
      default: 0,
    },
    rotateZ: {
      type: [Number, String],
      default: 0,
    },
  })

  const cardItemRef = ref(null)
  const mouseState = inject('use3DCardMouseState')

  const transformFrom = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
  const transformTo = `translateX(${props.translateX}px) translateY(${props.translateY}px) translateZ(${props.translateZ}px) rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg) rotateZ(${props.rotateZ}deg)`

  onMounted(() => {
    if (cardItemRef.value) {
      cardItemRef.value.style.transform = transformFrom
    }
  })

  watch(mouseState.isMouseEntered, isEntered => {
    if (cardItemRef.value) {
      cardItemRef.value.style.transform = isEntered ? transformTo : transformFrom
    }
  })
</script>
