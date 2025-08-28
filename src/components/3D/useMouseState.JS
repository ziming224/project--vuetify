// import { ref, readonly } from 'vue'

// export function useMouseState() {
//   const isMouseEntered = ref(false)

//   function setMouseEntered(value) {
//     isMouseEntered.value = value
//   }

//   function setTouchEntered(value) {
//   isMouseEntered.value = value
// }
// return {
//   isMouseEntered: readonly(isMouseEntered),
//   setMouseEntered,
//   setTouchEntered,
// }
// }
import { ref } from 'vue'

export function useMouseState() {
  const isMouseEntered = ref(false)
  const isTouchEntered = ref(false)

  function setMouseEntered(value) {
    isMouseEntered.value = value
  }

  function setTouchEntered(value) {
    isTouchEntered.value = value
  }

  return {
    isMouseEntered,
    isTouchEntered,
    setMouseEntered,
    setTouchEntered,
  }
}
