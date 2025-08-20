<template>
  <v-btn
    class="pa-0 text-draw-btn"
    variant="text"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <span class="text-draw__p">{{ text }}</span>
    <div ref="box" class="text-draw__box" />
  </v-btn>
</template>

<script setup>
  import { gsap } from 'gsap'
  import DrawSVGPlugin from 'gsap/DrawSVGPlugin'
  import { ref } from 'vue'

  gsap.registerPlugin(DrawSVGPlugin)

  // props
  const props = defineProps({
    text: { type: String, required: true },
    color: { type: String, default: 'black' },
    speed: { type: Number, default: 0.5 },
  })

  // refs
  const box = ref(null)
  let nextIndex = null
  let enterTween = null
  let leaveTween = null

  // svg variants
  const svgVariants = [
    `<svg viewBox="0 0 100 10"><path d="M0,5 L100,5" /></svg>`,
    `<svg viewBox="0 0 100 10"><path d="M0,5 Q50,10 100,5" /></svg>`,
    `<svg viewBox="0 0 100 10"><path d="M0,5 Q50,0 100,5" /></svg>`,
  ]

  function decorateSVG (svgEl) {
    svgEl.setAttribute('class', 'text-draw__box-svg')
    svgEl.setAttribute('preserveAspectRatio', 'none')
    for (const path of svgEl.querySelectorAll('path')) {
      path.setAttribute('stroke', props.color)
      path.setAttribute('stroke-width', '2')
      path.setAttribute('fill', 'transparent')
    }
  }

  function onMouseEnter () {
    if (!box.value) return
    if (enterTween?.isActive()) return
    leaveTween?.kill()

    if (nextIndex === null) {
      nextIndex = Math.floor(Math.random() * svgVariants.length)
    }

    box.value.innerHTML = svgVariants[nextIndex]
    const svg = box.value.querySelector('svg')
    if (svg) {
      decorateSVG(svg)
      const path = svg.querySelector('path')
      if (path) {
        gsap.set(path, { drawSVG: '0%' })
        enterTween = gsap.to(path, {
          duration: props.speed,
          drawSVG: '100%',
          ease: 'power2.inOut',
          onComplete: () => {
            enterTween = null
          },
        })
      }
    }

    nextIndex = (nextIndex + 1) % svgVariants.length
  }

  function onMouseLeave () {
    if (!box.value) return
    const path = box.value.querySelector('path')
    if (!path) return

    const playOut = () => {
      if (leaveTween?.isActive()) return
      leaveTween = gsap.to(path, {
        duration: props.speed,
        drawSVG: '100% 100%',
        ease: 'power2.inOut',
        onComplete: () => {
          leaveTween = null
          box.value.innerHTML = ''
        },
      })
    }

    if (enterTween?.isActive()) {
      enterTween.eventCallback('onComplete', playOut)
    } else {
      playOut()
    }
  }
</script>

<style scoped>
.text-draw-btn {
  position: relative;
  overflow: visible;
}

.text-draw__p {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.text-draw__box {
  width: 100%;
  height: 0.625em;
  position: absolute;
  bottom: 0;
  left: 0;
}

.text-draw__box-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: visible !important;
}
</style>
